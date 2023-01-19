import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedModule } from "./shared/shared.module";
import { LoggerMiddleware } from "./utils/middlewares/logger.middleware";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./utils/filters/http-exception.filter";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    SharedModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
