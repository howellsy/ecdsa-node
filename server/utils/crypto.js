const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, bytesToHex } = require("ethereum-cryptography/utils");

const hashString = (str) => keccak256(utf8ToBytes(str));

const recoverKey = (msg, signature, rBit) => secp.recoverPublicKey(
  hashString(msg),
  signature,
  rBit
);

const keyToAddress = (key) => {
  const publicKey = key.slice(1);
  const ethAddress = keccak256(publicKey).slice(-20);
  return `0x${bytesToHex(ethAddress)}`;
};

module.exports = { recoverKey, keyToAddress };
