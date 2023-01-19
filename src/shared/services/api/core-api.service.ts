import { Injectable, Logger } from "@nestjs/common";
import BaseApiService from "./base-api.service";
import { ConfigService } from "./../config/config.service";
import { RequestContext } from "../../../utils/request-context";
import { MyriaException } from "../../../utils/exceptions/myria-exception";
import { UserErrorException } from "../../../utils/exceptions/user-error.exception";
import {
  AssetTransferApiResponseInterface,
  AssetTransferInterface,
  TransferBuildPayloadInterface,
} from "./interfaces/transfer.interface";
import {
  VaultCreateInterface,
  VaultERC20CreateInterface,
  VaultERC721CreateInterface,
} from "./interfaces/vault-create.interface";
import { VaultResponseInterface } from "./interfaces/vault-response";

@Injectable()
export class CoreApiService extends BaseApiService {
  constructor(configService: ConfigService) {
    super(configService.myriaCoreServiceUrl, configService);
  }
  private readonly logger = new Logger(CoreApiService.name);

  async getL2WalletOfStarkKey(
    context: RequestContext,
    starkKey: string
  ): Promise<any> {
    try {
      const response = await this.get(
        context,
        "/v1/users/stark-key/" + starkKey,
        undefined,
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId } = context;
      this.logger.error({
        error,
        correlationId,
      });
      return null;
    }
  }

  async registerL2Wallet(
    context: RequestContext,
    ethAddress: string,
    starkKey: string,
    signature: any
  ): Promise<any> {
    try {
      const response = await this.post(
        context,
        "/v1/users/",
        {
          ethAddress,
          starkKey,
          signature,
        },
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId } = context;
      this.logger.error({
        error,
        correlationId,
      });
      throw new MyriaException(
        UserErrorException.USER_MYRIA_UNABLE_TO_REGISTER_L2_WALLET
      );
    }
  }

  async transactionsTransfer(
    context: RequestContext,
    data: AssetTransferInterface
  ): Promise<AssetTransferApiResponseInterface> {
    try {
      const response = await this.post(
        context,
        "/v1/transactions/transfer",
        data,
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.transactionsTransfer";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }

  async createVaultErc20(
    context: RequestContext,
    payload: VaultERC20CreateInterface
  ): Promise<VaultResponseInterface> {
    try {
      const response = await this.post(context, "/v1/vaults/erc20", payload, {
        "x-api-key": this.configService.myriaCoreServiceApiKey,
      });
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.createVaultErc20";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }

  async createVaultErc721(
    context: RequestContext,
    payload: VaultERC721CreateInterface
  ): Promise<VaultResponseInterface> {
    try {
      const response = await this.post(
        context,
        "/v1/vaults/mintable-erc721",
        payload,
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.createVaultErc721";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }

  async createVault(
    context: RequestContext,
    payload: VaultCreateInterface
  ): Promise<VaultResponseInterface> {
    try {
      const response = await this.post(context, "/v1/vaults/eth", payload, {
        "x-api-key": this.configService.myriaCoreServiceApiKey,
      });
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.createVaultEth";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }

  async getNonceCount(
    context: RequestContext,
    starkKey: string
  ): Promise<number> {
    try {
      const response = await this.get(
        context,
        "/v1/transactions/stark-key/" + starkKey + "/nonce-count",
        undefined,
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.getNonceCount";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }
  async buildTransferPayload(
    context: RequestContext,
    payload: TransferBuildPayloadInterface
  ): Promise<any> {
    try {
      const response = await this.post(
        context,
        "/v1/signatures/build-transfer-payload",
        payload,
        {
          "x-api-key": this.configService.myriaCoreServiceApiKey,
        }
      );
      return response?.data.data;
    } catch (error) {
      const { correlationId, logger } = context;
      const msg = "Exception error in CoreApiService.buildTransferPayload";
      logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }
}
