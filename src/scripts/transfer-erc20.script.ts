import {
  IMyriaClient,
  ModuleFactory,
  EnvTypes,
  TransferERC20Params,
} from "myria-core-sdk";
import Web3 from "web3";
import fs from "fs";
import getStream from "get-stream";
import { parse } from "csv-parse";
import { Logger } from "@nestjs/common";
import { convertAmountToQuantizedAmount } from "../utils/convert-eth";
import { CoreApiService } from "../shared/services/api/core-api.service";
import { ConfigService } from "../shared/services/config/config.service";
import { RequestContext } from "../utils/request-context";
import { v4 as uuidv4 } from "uuid";
import { waitTime } from "../utils/wait-time";
import { millisecondsToMinutesAndSeconds } from "../utils/milliseconds-to-minutes-seconds";
import { retry } from "../utils/retry";
export const CHUNK_NUMBER = 10;
export class TransferErc20 {
  logger = new Logger(TransferErc20.name);
  private filePath = "public/storages";

  constructor(
    private readonly configService: ConfigService, 
    private readonly coreApiService: CoreApiService, 
    fileName?: string) {
      this.configService = configService;
      this.coreApiService = coreApiService;
    this.filePath = fileName
      ? `${this.filePath}/${configService.env}/${fileName}`
      : `${this.filePath}/${configService.env}/transfer-erc20.csv`;
  }
  readCSVData = async (filePath: string): Promise<any> => {
    const parseStream = parse({ delimiter: "," });
    const data = await getStream.array(
      fs.createReadStream(filePath).pipe(parseStream)
    );
    return data.map((line: any) => line.join(",")).join("\n");
  };
  async execute() {
    const beginTime = Date.now();
    const mClient: IMyriaClient = {
      networkId: 5,
      provider: null,
      web3: new Web3(),
      env: EnvTypes.STAGING,
    };
    const trackingLog: any = [];
    const {
      quantumERC20,
      tokenAddressERC20,
      senderStarkPrivateKey
    } = this.configService;
    const correlationId = `transfer-erc20-${uuidv4()}`;
    const requestContext: RequestContext = {
      correlationId,
      logger: this.logger,
      user: {},
    };

    const moduleFactory = ModuleFactory.getInstance(mClient);
    const userManager = moduleFactory.getUserManager();

    const data = await this.readCSVData(this.filePath);
    const arrayData = data.split("\n");
    
    // chunk CSV
    const segments = arrayData.reduce((resultArray: any, tx, index) => {
      const chunkIndex = Math.floor(index / CHUNK_NUMBER);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      const item = tx.split(",");
      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    if (segments.length > 0) {
      for await (const segment of segments) {
        // group of chunk
        if (segment.length > 0) {
          const transferArrayParams: TransferERC20Params[] = [];
          for await (const item of segment) {
            const [senderWalletAddress, receiverWalletAddress, amount] = item;
            const senderAccount = await userManager.getUserByWalletAddress(
              senderWalletAddress
            );
            const receiverAccount = await userManager.getUserByWalletAddress(
              receiverWalletAddress
            );

            if (senderAccount) {
              transferArrayParams.push({
                senderWalletAddress,
                senderPublicKey: senderAccount.starkKey,
                receiverPublicKey: receiverAccount.starkKey,
                tokenAddress: tokenAddressERC20,
                quantizedAmount: String(convertAmountToQuantizedAmount(amount)),
              });
            }
          }
          // process transfer
          if (transferArrayParams.length > 0) {
            const [first] = transferArrayParams;
            let nonce = await this.coreApiService.getNonceCount(
              requestContext,
              first.senderPublicKey
            );
            try {
              for await (const iterator of transferArrayParams) {
                const vaultSender = await this.coreApiService.createVaultErc20(
                  requestContext,
                  {
                    starkKey: iterator.senderPublicKey,
                    quantum: quantumERC20,
                    tokenAddress: tokenAddressERC20,
                  }
                );
                const vaultReceiver =
                  await this.coreApiService.createVaultErc20(requestContext, {
                    starkKey: iterator.receiverPublicKey,
                    quantum: quantumERC20,
                    tokenAddress: tokenAddressERC20,
                  });
                const buildTransferErc20Payload =
                  await this.coreApiService.buildTransferPayload(
                    requestContext,
                    {
                      senderPrivateKey: senderStarkPrivateKey,
                      senderVaultId: vaultSender.vaultId,
                      receiverVaultId: vaultReceiver.vaultId,
                      token: vaultSender.assetId, // token = assetId
                      nonce,
                      receiverPublicKey: iterator.receiverPublicKey,
                      quantizedAmount: iterator.quantizedAmount,
                    }
                  );

                // retry
                const { response, retryAttempt } = await retry<any>(
                  async () => {
                    try {
                      const response =
                        await this.coreApiService.transactionsTransfer(
                          requestContext,
                          buildTransferErc20Payload
                        );
                      nonce++;
                      await waitTime(1000);
                      return response;
                    } catch (error) {
                      nonce = await this.coreApiService.getNonceCount(
                        requestContext,
                        first.senderPublicKey
                      );
                      throw error;
                    }
                  },
                  1000,
                  3
                );

                if (!response) {
                  const body = {
                    correlationId,
                    msg: `Transfer is not success with ${nonce}`,
                    data: {
                      response,
                      retryAttempt,
                      nonce,
                      payloadErc20: buildTransferErc20Payload,
                    },
                  };
                  this.logger.warn({ ...body });
                  trackingLog.push(body);
                }
              }

              if (trackingLog.length > 0) {
                fs.writeFileSync(
                  `public/logs/error-transfer-erc20-${Date.now()}.json`,
                  JSON.stringify(trackingLog)
                );
              }
              const endTime = Date.now();
              const diffTime = endTime - beginTime;
              this.logger.warn({
                correlationId,
                msg: `Duration time executed ${millisecondsToMinutesAndSeconds(
                  diffTime
                )}s`,
              });
            } catch (error) {
              this.logger.error({
                error,
                correlationId,
              });
            }
          }
        }
      }
    }
  }
}

// Entry point function to do the transfer ERC20
function doTransferERC20() {
  const configService = new ConfigService();
  const coreApiService = new CoreApiService(configService);
  const transfer = new TransferErc20(
    configService, coreApiService
  );
  try {
    transfer.execute();
  } catch (error) {
    transfer.logger.error({
      msg: "Transfer ERC20 error",
      error,
    });
  }
}
doTransferERC20();