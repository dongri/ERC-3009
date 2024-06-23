const tokenAddress = '0x371b616bC1D3C82c88BbE271c7B404C75A92854E'; // SimpleToken address
const tokenName = 'SimpleToken';
const tokenVersion = '1';

const recipientAddress = '0xD5Dc16f9A85d26582c3Ed172761c5b46F1346947'; // Bob address

document.getElementById('signButton').addEventListener('click', async () => {

  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      console.log('MetaMask connected');
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('MetaMask is not installed');
  }

  const userAddress = (await ethereum.request({ method: 'eth_accounts' }))[0];
  const amountBN = web3.utils.toWei('1', 'ether'); // 1 Token

  const data = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      TransferWithAuthorization: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'validAfter', type: 'uint256' },
        { name: 'validBefore', type: 'uint256' },
        { name: 'nonce', type: 'bytes32' },
      ],
    },
    domain: {
      name: tokenName,
      version: tokenVersion,
      chainId: await web3.eth.getChainId(),
      verifyingContract: tokenAddress,
    },
    primaryType: 'TransferWithAuthorization',
    message: {
      from: userAddress,
      to: recipientAddress,
      value: amountBN.toString(10),
      validAfter: 0,
      validBefore: Math.floor(Date.now() / 1000) + 3600,
      nonce: web3.utils.randomHex(32),
    },
  };

  const signature = await ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [userAddress, JSON.stringify(data)],
  });

  const v = parseInt(signature.slice(130, 132), 16);
  const r = signature.slice(0, 66);
  const s = "0x" + signature.slice(66, 130);

  const payload = {
    from: data.message.from,
    to: data.message.to,
    value: data.message.value,
    validAfter: data.message.validAfter,
    validBefore: data.message.validBefore,
    nonce: data.message.nonce,
    v: v,
    r: r,
    s: s,
  };

  try {
    const response = await fetch('http://localhost:3001/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log('data:', data);
    document.getElementById('result').innerText = `TxHash: ${data.txHash}`;
  } catch (error) {
      console.error(error);
  }
});
