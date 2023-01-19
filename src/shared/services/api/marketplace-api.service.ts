import { Injectable, Logger } from "@nestjs/common";
import BaseApiService from "./base-api.service";
import { ConfigService } from "./../config/config.service";
import { RequestContext } from "../../../utils/request-context";
import {
  AssetTransferApiResponseInterface,
  AssetTransferInterface,
} from "./interfaces/transfer.interface";

@Injectable()
export class MarketplaceApiService extends BaseApiService {
  constructor(configService: ConfigService) {
    super(configService.myriaMarketplaceServiceUrl, configService);
  }
  private readonly logger = new Logger(MarketplaceApiService.name);

  async transferErc721(
    context: RequestContext,
    data: AssetTransferInterface
  ): Promise<AssetTransferApiResponseInterface> {
    try {
      const response = await this.post(context, "/v1/assets/transfer", data, {
        "x-api-key": this.configService.myriaMarketplaceServiceApiKey,
      });
      return response?.data.data;
    } catch (error) {
      const { correlationId } = context;
      const msg = "Exception error in MarketplaceApiService.transferErc721";
      this.logger.error({
        msg,
        correlationId,
        error,
      });

      throw error;
    }
  }
}
