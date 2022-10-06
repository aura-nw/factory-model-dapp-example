# factory-model-dapp-example
In order to mint NFT, you must store smart contract into Aura Network. You can read [aura docs](https://docs.aura.network/developer/contract/introduction) to know step-by-step how to store and instantiate contract. If everything is correct, you should receive contract address. Beside, there are some ways to execute smart contract to mint NFT. Easiest way to do that, you can use cosmJs and mnemonic to broadcast tx to mint NFT. You can see example i had wrote in [nft-service](./backend-service/src/services/impls/nft.service.ts). When execute contract you can meet some error, just check:
- Is your's address have enough balance to execute?
- Is smart contract correct?
- Is execute msg correct?

Just chill and code :D.