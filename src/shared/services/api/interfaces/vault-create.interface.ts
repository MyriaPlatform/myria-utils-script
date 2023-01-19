import { TokenType } from "../enums/token-type.enum";

export interface VaultCreateInterface {
  starkKey: string;

  tokenType: TokenType;

  quantum?: string;

  tokenId?: string;

  tokenAddress?: string;
}

export interface VaultERC20CreateInterface {
  starkKey: string;

  quantum: string;

  tokenAddress: string;
}

export interface VaultERC721CreateInterface {
  starkKey: string;

  tokenAddress: string;

  tokenId: string;
}