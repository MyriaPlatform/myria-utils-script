const starkwareCrypto = require("@starkware-industries/starkware-crypto-utils");
export interface Signature {
  r: string;
  s: string;
}

export const getTransferSignature = async (
  quantizedAmount: string,
  nonce: number,
  senderVaultId: number,
  token: string,
  receiverVaultId: number,
  receiverPublicKey: string,
  expirationTimestamp: number,
  privateStarkKey: string
): Promise<Signature> => {
  const msgHash = starkwareCrypto.getTransferMsgHash(
    quantizedAmount,
    nonce,
    senderVaultId,
    token,
    receiverVaultId,
    receiverPublicKey,
    expirationTimestamp
  );

  const keyPair = starkwareCrypto.ec.keyFromPrivate(privateStarkKey, "hex");
  const signature = await starkwareCrypto.sign(keyPair, msgHash);
  const r = `0x${signature.r.toJSON()}`;
  const s = `0x${signature.s.toJSON()}`;

  return { r: r, s: s };
};
