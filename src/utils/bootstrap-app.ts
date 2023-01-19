import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'node:path';
import 'source-map-support/register';
import { ConfigService } from '../shared/services/config/config.service';
import { ErrorResponseTransformInterceptor } from './interceptors/error-response-transform.interceptor';
import { SuccessResponseTransformInterceptor } from './interceptors/success-response-transform.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

export async function bootstrapApp(
    app: NestExpressApplication,
    configService: ConfigService,
) {
    const { apiVersion, backendBaseUrl } = configService;
    app.setGlobalPrefix(apiVersion, {
        exclude: [
            { path: '', method: RequestMethod.GET },
            {
                path: '/test/is-myria-core-available',
                method: RequestMethod.GET,
            },
            {
                path: '/status',
                method: RequestMethod.GET,
            },
        ],
    });
    const config = new DocumentBuilder()
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-key',
                in: 'header',
                description: 'API key for external calls',
            },
            'x-api-key',
        )
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-admin-key',
                in: 'header',
                description: 'API Admin key for external calls',
            },
            'x-api-admin-key',
        )
        .setTitle('Myria Util Services')
        .setDescription('The API description')
        .setVersion('1.0')
        .setExternalDoc('Postman Collection', `${backendBaseUrl}/api-docs-json`)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiVersion}/api-docs`, app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');

    app.use(helmet());
    const { corsEnabled, corsAllowedOrigins } = new ConfigService();
    const cors = corsEnabled
        ? {
              methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
              allowedHeaders: [
                  'Authorization',
                  'RefreshToken',
                  'Content-Type',
                  'Accept',
                  'Origin',
                  'Referer',
                  'User-Agent',
                  'Authorization',
                  'X-Signature',
                  'X-Api-Key',
                  'X-Api-Admin-Key',
                  'X-Request-Id',
              ],
              exposedHeaders: [
                  'Authorization',
                  'RefreshToken',
                  'X-Api-Key',
                  'X-Api-Admin-Key',
                  'AccessToken',
                  'X-Signature',
              ],
              origin(
                  origin: string,
                  callback: (error: Error | null, success?: true) => void,
              ) {
                  if (corsAllowedOrigins === 'all') {
                      callback(null, true);
                      return;
                  }
                  if (corsAllowedOrigins.includes(origin)) {
                      callback(null, true);
                  } else {
                      callback(
                          new Error(`Origin[${origin}] not allowed by CORS`),
                      );
                  }
              },
          }
        : {};
    app.enableCors(cors);
    app.useGlobalInterceptors(
        new SuccessResponseTransformInterceptor(),
        new ErrorResponseTransformInterceptor(),
        new TransformInterceptor(),
        new TimeoutInterceptor(configService),
    );
}
