## Install & Deploy
```
$ forge install OpenZeppelin/openzeppelin-contracts --no-commit --quiet

$ forge build

$ make deploy

##### sepolia
✅  [Success]Hash: 0xee9e7393667ddc355dd59a932264e70edacd4ccfae91806759b576618593470a
Contract Address: 0x371b616bC1D3C82c88BbE271c7B404C75A92854E
Block: 6167785
Paid: 0.001656107019504652 ETH (871778 gas * 1.899688934 gwei)
```

## Get ABI
```
$ forge inspect SimpleToken abi | jq -c
[{"type":"constructor","inputs":[{"name":"name","type":"string","internalType":"string"}]....}]
```
