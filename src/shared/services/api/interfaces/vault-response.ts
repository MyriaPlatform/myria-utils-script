export interface VaultResponseInterface {
  vaultId: number;
  starkKey: string;
  assetId: string;
  assetType: string;
  quantizedAmount: string;
  createdAt: number;
  updatedAt?: number;
}
