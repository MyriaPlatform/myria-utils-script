import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from "@nestjs/common";
import axios, { AxiosRequestHeaders } from "axios";
import { RequestContext } from "../../../utils/request-context";
import { ConfigService } from "../config/config.service";
import FormData from "form-data";

export interface QueryParams {
  [key: string]: string | number | undefined;
}

export default abstract class BaseApiService {
  protected baseURL = "";

  protected context: RequestContext;

  protected configService: ConfigService;

  constructor(baseURL: string, configService: ConfigService) {
    this.baseURL = baseURL;
    this.configService = configService;
  }

  protected handleError(error: any) {
    if (error.response) {
      const { status, statusText } = error?.response;
      if (error.response.status === HttpStatus.NOT_FOUND) {
        this.context.logger.error(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new NotFoundException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      if (error.response.status === HttpStatus.BAD_REQUEST) {
        this.context.logger.error(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new BadRequestException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        this.context.logger.error(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new UnauthorizedException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      if (error.response.status === HttpStatus.CONFLICT) {
        this.context.logger.error(
          {
            ...error.response.data,
            correlationId: this.context.correlationId,
          },
          "Request to api"
        );
        throw new ConflictException({
          status,
          statusText,
          apiErrors: error.response.data,
        });
      }
      throw new InternalServerErrorException({
        status,
        statusText,
        apiErrors: error.response.data,
      });
    }
    if (error.code === "ECONNREFUSED") {
      throw new InternalServerErrorException({
        message: "Connection refused",
      });
    }

    this.context.logger.error(
      {
        error,
        correlationId: this.context.correlationId,
      },
      "Request to api"
    );
    throw new InternalServerErrorException(error);
  }

  protected async get(
    context: RequestContext,
    url: string,
    query?: QueryParams,
    headers?: AxiosRequestHeaders
  ) {
    try {
      this.context = context;
      if (headers) {
        headers["x-correlation-id"] = context.correlationId;
      }

      const response = await axios.get(url, {
        params: query,
        headers,
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async post(
    context: RequestContext,
    url: string,
    data: any,
    headers?: AxiosRequestHeaders
  ) {
    try {
      this.context = context;
      if (headers) {
        headers["x-correlation-id"] = context.correlationId;
      }
      const response = await axios.post(url, data, {
        headers,
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async put(
    context: RequestContext,
    url: string,
    data: any,
    headers?: AxiosRequestHeaders
  ) {
    try {
      this.context = context;
      if (headers) {
        headers["x-correlation-id"] = context.correlationId;
      }
      const response = await axios.put(url, data, {
        headers,
        baseURL: this.baseURL,
        timeout: this.configService.timeoutResponse,
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async delete(
    context: RequestContext,
    url: string,
    data?: any,
    headers?: AxiosRequestHeaders
  ) {
    try {
      this.context = context;
      if (headers) {
        headers["x-correlation-id"] = context.correlationId;
      }
      const response = await axios.delete(url, {
        headers,
        timeout: this.configService.timeoutResponse,
        baseURL: this.baseURL,
        data,
      });
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected convertObjectToFormData(input: Record<string, unknown>): FormData {
    const formData = new FormData();
    for (const key in input) {
      formData.append(key, `${input[key]}`);
    }
    return formData;
  }
}
