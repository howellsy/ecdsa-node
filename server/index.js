const express = require("express");
const app = express();
const cors = require("cors");
const { keyToAddress, recoverKey } = require('./utils/crypto');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // private key = c9bb8727e3d14d51771379bb7daa2adb8fd2a48cc3a18e263c8ba4281cfe0e1b
  "0x6b065d5097bf074113e3bb478cc7c99ee51535ee": 100,
  // private key = 108c1108f08eeb54fe31d29db9318136a5b6d316ae3b05867d1b8a96d9d1ebc1
  "0x35819f5adc4136e3c42feccf6c9bad8615a423a4": 50,
  // private key = a0227fe202adcede02f2ca90455f74671bfe2835f2fc277703db22cf18359ec5
  "0xbdb08e6d8c3b9cfdea9d9957eef409438bf7e077": 75,
};

/**
 * Verifies a message signature and returns a matching eth address.
 * @returns {(string | null)} A matching eth address or null
 */
const verifySignature = (msg, signature, rBit) => {
  const publicKey = recoverKey(msg, signature, rBit);
  const ethAddr = keyToAddress(publicKey);

  if (balances[ethAddr]) {
    return ethAddr;
  }

  return null;
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, rBit } = req.body;

  const ethAddress = verifySignature(amount.toString(), signature, rBit);

  if (ethAddress && ethAddress === sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(401).send({ message: "Unauthorised." });
  }  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
