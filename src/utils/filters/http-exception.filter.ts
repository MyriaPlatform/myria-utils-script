import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../shared/services/config/config.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private configService: ConfigService) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.getResponse() as {
            key: string;
            args: Record<string, unknown>;
        };
        const externalErrors = this.configService.isEnableExternalError
            ? message['apiErrors'] ?? undefined
            : undefined;
        let errorCodeFromCore = null || undefined;

        try {
            if (externalErrors) {
                errorCodeFromCore = externalErrors.errors[0].errorCode;
            }
        } catch (error) {
            request.logger.error(error);
        }

        response.status(status).json({
            status: 'error',
            errors: [
                {
                    code: status,
                    title: message['error'],
                    errorCode: message['errorCode'],
                    detail: message['message'],
                    correlationId: request.correlationId || '',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    externalErrorCode: errorCodeFromCore,
                    externalErrors,
                },
            ],
        });
    }
}
