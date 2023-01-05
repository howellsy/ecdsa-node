import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  useEffect(() => {
    if (address) {
      (async () => {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      })();
    } else {
      setBalance(0);
    }
  }, [address]);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address:
        <input 
          placeholder="Type an address"
          value={address}
          onChange={setValue(setAddress)}>
        </input>
      </label>
      <label>
        Private key:
        <input 
          placeholder="Type a private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}>
        </input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
