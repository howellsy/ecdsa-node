 const secp = require("ethereum-cryptography/secp256k1");
 const { toHex } = require("ethereum-cryptography/utils");
 const { keccak256 } = require("ethereum-cryptography/keccak");

const getAddress = (publicKey) => {
  // the first byte of the key will contain the format (compressed or not)
  const keyWithFormatByteRemoved = publicKey.slice(1);

  const keccakHash = keccak256(keyWithFormatByteRemoved);

  // the address will be in the last 20 bytes of the hash
  return keccakHash.slice(- 20);
}

 const privateKey = secp.utils.randomPrivateKey(); 
 console.log('🚨 private key', toHex(privateKey));
 console.log('🚨 address', toHex(getAddress(publicKey)));
