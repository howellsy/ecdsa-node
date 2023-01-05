import { useState } from "react";
import server from "./server";
import { signMessage } from "./utils/crypto";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (privateKey.length === 0) {
      window.alert("Please enter a private key to sign the transaction");
      return;
    }

    try {
      const [signature, rBit] = await signMessage(sendAmount, privateKey);

      if (signature) {
        const { data: { balance } } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
          signature,
          rBit
        });

        setBalance(balance);
      }
    } catch (error) {
      if (error?.request?.status === 401) {
        window.alert("You are not authorised to make this transaction");
      } else {
        window.alert(error);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount:
        <input
          placeholder="Type an amount"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient:
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
