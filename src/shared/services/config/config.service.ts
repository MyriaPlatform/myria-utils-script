/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string | any };

  constructor() {
    let fileName = "../../../../configs/config.json";
    // This config use for local testing
    if (process.env.IS_INTEGRATION_TEST) {
      fileName = "../../../../configs/config.test.json";
    }
    const jsonEnvPath = path.join(__dirname, fileName);
    const jsonEnv = fs.readFileSync(jsonEnvPath);
    this.envConfig = JSON.parse(jsonEnv as any);
  }
  private int(value: string | undefined, number: number): number {
    return value
      ? Number.isNaN(Number.parseInt(value))
        ? number
        : Number.parseInt(value)
      : number;
  }

  private bool(value: string | undefined, boolean: boolean): boolean {
    return value === null || value === undefined ? boolean : value === "true";
  }

  private cors(value: string | undefined): string[] | "all" {
    if (value === "all" || value === undefined) {
      return "all";
    }

    return value
      ? value.split(",").map((name) => name.trim())
      : ["http://localhost:3000"];
  }
  private whitelistedApis(value: string): string[] {
    return value ? value.split(",").map((key) => key.trim()) : [];
  }

  get env(): string {
    return this.envConfig["environment"] || "dev";
  }

  get backendBaseUrl(): string {
    return (
      this.envConfig["backendBaseUrl"] ||
      "http://localhost:" + this.port + "/" + this.apiVersion
    );
  }
  get apiKey(): string {
    return this.whitelistedApiKeys.length ? this.whitelistedApiKeys[0] : "";
  }
  get whitelistedApiKeys(): string[] {
    return this.whitelistedApis(this.envConfig["whitelistedApiKeys"]);
  }

  get myriaCoreServiceApiKey(): string {
    return this.envConfig["myriaCoreServiceApiKey"] || "";
  }

  get myriaMarketplaceServiceApiKey(): string {
    return this.envConfig["myriaMarketplaceServiceApiKey"] || "";
  }

  get host(): string {
    return this.envConfig["host"] || "127.0.0.1";
  }

  get port(): number {
    return this.int(this.envConfig["port"], 8081);
  }

  get timeoutResponse(): number {
    return this.int(this.envConfig["timeoutResponse"], 90000);
  }

  get corsAllowedOrigins(): string[] | string {
    return this.cors(this.envConfig["corsAllowedOrigins"] || "all");
  }

  get corsEnabled(): boolean {
    return this.bool(this.envConfig["corsEnabled"], true);
  }
  get apiVersion(): string {
    return this.envConfig["apiVersion"] || "v1";
  }

  get apiSemanticVersion(): string {
    return this.envConfig["apiSemanticVersion"] || "v1.0.0";
  }

  get region(): string {
    return this.envConfig["region"] || "us-east-1";
  }

  get myriaCoreServiceUrl(): string {
    return (
      this.envConfig["myriaCoreServiceUrl"] ||
      "https://dev.myriacore-api.nonprod-myria.com"
    );
  }

  get myriaMarketplaceServiceUrl(): string {
    return (
      this.envConfig["myriaMarketplaceServiceUrl"] ||
      "https://dev.myriacore-marketp-api.nonprod-myria.com"
    );
  }

  get myriaAccountServiceUrl(): string {
    return (
      this.envConfig["myriaAccountServiceUrl"] ||
      "https://staging.myriaverse-api.nonprod-myria.com"
    );
  }

  get isEnableExternalError(): boolean {
    return this.bool(this.envConfig["isEnableExternalError"], false);
  }

  get serverStatus(): string {
    return this.envConfig["serverStatus"] || "AVAILABLE";
  }

  get tokenAddressERC20(): string {
    return this.envConfig["tokenAddressERC20"] || "";
  }

  get tokenAddressERC721(): string {
    return this.envConfig["tokenAddressERC721"] || "";
  }

  get quantumERC20(): string {
    return "10000000000";
  }
  get senderStarkPrivateKey(): string {
    return this.envConfig["senderStarkPrivateKey"] || "";
  }
  get senderStarkPublicKey(): string {
    return this.envConfig["senderStarkPublicKey"] || "";
  }
}
