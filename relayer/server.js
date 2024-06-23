const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const app = express();

require('dotenv').config();

app.use(cors());

app.use(bodyParser.json());

const RPC_URL = process.env.SEPOLIA_RPC_URL
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS
const RELAYER_PRIV_KEY = process.env.RELAYER_PRIV_KEY
const TOKEN_ABI = process.env.TOKEN_ABI

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const contractABI = JSON.parse(TOKEN_ABI);
const contractAddress = TOKEN_ADDRESS;

const contract = new web3.eth.Contract(contractABI, TOKEN_ADDRESS);

app.post('/signature', async (req, res) => {
  const { from, to, value, validAfter, validBefore, nonce, v, r, s } = req.body;
  try {
    let method = contract.methods.transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, v, r, s);
    
    const tx = {
      to: contractAddress,
      data: method.encodeABI(),
      gas: await method.estimateGas({ from }),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, RELAYER_PRIV_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction receipt:', receipt);
    res.json({ txHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error in transferWithAuthorization:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
