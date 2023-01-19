import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "./services/config/config.service";
import { CoreApiService } from "./services/api/core-api.service";

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: [".json"],
    }),
    HttpModule.register({}),
  ],
  exports: [ConfigService, CacheModule, HttpModule, CoreApiService],
  providers: [ConfigService, HttpModule, CoreApiService],
})
export class SharedModule {}
