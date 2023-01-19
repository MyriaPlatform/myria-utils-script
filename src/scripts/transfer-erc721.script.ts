import {
  IMyriaClient,
  ModuleFactory,
  EnvTypes,
  TransferERC721Params,
} from "myria-core-sdk";
import Web3 from "web3";
import fs from "fs";
import getStream from "get-stream";
import { parse } from "csv-parse";
import { Logger } from "@nestjs/common";
import { CoreApiService } from "../shared/services/api/core-api.service";
import { ConfigService } from "../shared/services/config/config.service";
import { RequestContext } from "../utils/request-context";
import { v4 as uuidv4 } from "uuid";
import { waitTime } from "../utils/wait-time";
import { millisecondsToMinutesAndSeconds } from "../utils/milliseconds-to-minutes-seconds";
import { retry } from "../utils/retry";
import { getTransferSignature } from "../utils/generate-signature";
import { MarketplaceApiService } from "../shared/services/api/marketplace-api.service";

export const CHUNK_NUMBER = 10;
export const QUANTUM_ERC_721 = "1";

export class TransferErc721 {
  logger = new Logger(TransferErc721.name);
  private filePath = "public/storages";

  constructor(
    private readonly configService: ConfigService,
    private readonly coreApiService: CoreApiService,
    private readonly marketplaceApiService: MarketplaceApiService,
    fileName?: string
  ) {
    this.configService = configService;
    this.coreApiService = coreApiService;
    this.filePath = fileName
      ? `${this.filePath}/${configService.env}/${fileName}`
      : `${this.filePath}/${configService.env}/transfer-erc721.csv`;
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
    const { tokenAddressERC721, senderStarkPrivateKey } = this.configService;
    const correlationId = `transfer-erc721-${uuidv4()}`;
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
      const senderPublicKey = this.configService.senderStarkPublicKey;

      for await (const segment of segments) {
        // group of chunk
        if (segment.length > 0) {
          const transferArrayParams: TransferERC721Params[] = [];
          for await (const item of segment) {
            const [tokenId, receiverWalletAddress] = item;

            const receiverAccount = await userManager.getUserByWalletAddress(
              receiverWalletAddress
            );

            if (receiverAccount) {
              transferArrayParams.push({
                senderWalletAddress: "", // Not required
                senderPublicKey: senderPublicKey,
                receiverPublicKey: receiverAccount.starkKey,
                tokenAddress: tokenAddressERC721,
                tokenId: tokenId,
                quantizedAmount: QUANTUM_ERC_721,
              });
            }
          }
          // process transfer
          if (transferArrayParams.length > 0) {
            const [first] = transferArrayParams;
            let nonce = await this.coreApiService.getNonceCount(
              requestContext,
              senderPublicKey
            );
            try {
              for await (const iterator of transferArrayParams) {
                const vaultSender = await this.coreApiService.createVaultErc721(
                  requestContext,
                  {
                    starkKey: iterator.senderPublicKey,
                    tokenAddress: tokenAddressERC721,
                    tokenId: iterator.tokenId,
                  }
                );
                const vaultReceiver =
                  await this.coreApiService.createVaultErc721(requestContext, {
                    starkKey: iterator.receiverPublicKey,
                    tokenAddress: tokenAddressERC721,
                    tokenId: iterator.tokenId,
                  });

                const expirationTimestamp = Math.ceil(
                  (new Date().getTime() + 8 * 24 * 60 * 60 * 1000) / 3600000
                );
                const signature = await getTransferSignature(
                  QUANTUM_ERC_721,
                  nonce,
                  vaultSender.vaultId,
                  vaultSender.assetId,
                  vaultReceiver.vaultId,
                  iterator.receiverPublicKey,
                  expirationTimestamp,
                  senderStarkPrivateKey
                );

                const payload = {
                  senderVaultId: vaultSender.vaultId,
                  senderPublicKey: senderPublicKey,
                  receiverVaultId: vaultReceiver.vaultId,
                  receiverPublicKey: iterator.receiverPublicKey,
                  token: vaultSender.assetId, // assetId retrieved from vault info
                  quantizedAmount: QUANTUM_ERC_721,
                  nonce: nonce,
                  expirationTimestamp: expirationTimestamp, // epoch time + 7d in hours rounding up
                  signature: signature,
                };

                // retry
                const { response, retryAttempt } = await retry<any>(
                  async () => {
                    try {
                      const response =
                        await this.marketplaceApiService.transferErc721(
                          requestContext,
                          payload
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
                      payloadErc721: payload,
                    },
                  };
                  this.logger.warn({ ...body });
                  trackingLog.push(body);
                }
              }

              if (trackingLog.length > 0) {
                fs.writeFileSync(
                  `public/logs/error-transfer-erc721-${Date.now()}.json`,
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

// Entry point function to do the transfer ERC721
function doTransferERC721() {
  const configService = new ConfigService();
  const coreApiService = new CoreApiService(configService);
  const marketplaceApiService = new MarketplaceApiService(configService);
  const transfer = new TransferErc721(
    configService,
    coreApiService,
    marketplaceApiService
  );
  try {
    transfer.execute();
  } catch (error) {
    transfer.logger.error({
      msg: "Transfer ERC721 error",
      error,
    });
  }
}
doTransferERC721();
