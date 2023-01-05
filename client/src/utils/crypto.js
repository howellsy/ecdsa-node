import { sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, bytesToHex } from "ethereum-cryptography/utils";

const hashString = (str) => keccak256(utf8ToBytes(str));

export const signMessage = async (msg, privateKey) => {
  const [signature, rBit] = await sign(hashString(msg), privateKey, {
    recovered: true,
  });

  return [bytesToHex(signature), rBit];
};
