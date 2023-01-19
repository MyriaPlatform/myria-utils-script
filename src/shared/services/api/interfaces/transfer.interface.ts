import { SignatureInterface } from "./signature.interface";

export interface AssetTransferInterface {
  senderVaultId: number;

  senderPublicKey: string;

  receiverVaultId: number;

  receiverPublicKey: string;

  token: string;

  quantizedAmount: string;

  nonce: number;

  expirationTimestamp: number;

  signature: SignatureInterface;
}

export interface AssetTransferApiResponseInterface {
  vaultId: number;
  quantizedAmount: string;
  nonce: number;
  assetId: string;
  receiverPublicKey: string;
  receiverVaultId: number;
  expirationTimestamp: number;
  signature: SignatureInterface;
  starkKey: string;
  transactionCategory: string;
  transactionId: number;
  transactionType: string;
  transactionStatus: string;
  batchId: number;
  createdAt: number;
}

export interface TransferBuildPayloadInterface {
  senderPrivateKey: string;
  senderVaultId: number;
  receiverVaultId: number;
  receiverPublicKey: string;
  token: string;
  quantizedAmount: string;
  nonce: number;
}
