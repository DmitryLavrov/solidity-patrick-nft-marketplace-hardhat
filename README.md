## Getting Started

### Prerequisites

```shell
npm i npm@latest -g
npm init -y
```

### Installation

```shell
npm i -D hardhat
npx hardhat
```

```
Welcome to Hardhat v2.10.0

√ What do you want to do? · Create a TypeScript project
√ Hardhat project root: · C:\Projects\solidity-patrick-nft-marketplace-hardhat
√ Do you want to add a .gitignore? (Y/n) · y

You need to install these dependencies to run the sample project:
npm install --save-dev "hardhat@^2.10.0" "@nomicfoundation/hardhat-toolbox@^1.0.1"
```
```shell
npm i -D @openzeppelin/contracts
npm i -D @chainlink/contracts
```
```shell
npm i -D hardhat-deploy
🟥 npm i -D @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
npm i -D hardhat-deploy-ethers ethers
```
```shell
npm i -D ts-node typescript
npm i -D chai @types/node @types/mocha @types/chai
```

```shell
npm i -D dotenv
🟥 npm i -D @nomiclabs/hardhat-waffle ethereum-waffle
```

# Usage

## Useful commands
```shell
# 🟨 Terminal 1 
$ hh node

# 🟨 Terminal 2 
# Mint and List Item
$ hh run scripts/mintAndList.ts --network localhost
# Cancel Item
$ hh run scripts/cancelItem.ts --network localhost
# Buy Item
$ hh run scripts/buyItem.ts --network localhost
# Mine
$ hh run scripts/mine.ts --network localhost
# Mint
$ hh run scripts/mint.ts --network localhost

# Update Frontend constants
$ hh deploy --tags frontend --network localhost
```
### For The Graph
```shell
# Deploy to Rinkeby
$ hh deploy --network rinkeby

Nothing to compile
No need to generate any newer typings.
------------------------------------------------
deploying "NftMarketplace" (tx: 0x8a1dc110e485844eab56b20190e4f37aa0c9d5c298bd5b0166477d369cdef9a4)...: deployed at 0xEaad6E1D411bB30987DdE64043Bf14E56edBd9ad with 1355223 gas
NftMarketplace deployed!
------------------------------------------------
Waiting for block confirmations...
Verifying...
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/NftMarketplace.sol:NftMarketplace at 0xEaad6E1D411bB30987DdE64043Bf14E56edBd9ad
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NftMarketplace on Etherscan.
https://rinkeby.etherscan.io/address/0xEaad6E1D411bB30987DdE64043Bf14E56edBd9ad#code
deploying "BasicNft" (tx: 0x86ceee351895ae4d84786eb173068ccb7fdcd2e24e09b52b1657afe24241a7a8)...: deployed at 0x83173a154693a7062D9899Ff9e10F4ec18834e8A with 2014565 gas
BasicNft deployed!
------------------------------------------------
Waiting for block confirmations...
Verifying...
Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
  --> contracts/test/basicNft.sol:20:23:
   |
20 |     function tokenURI(uint tokenId ) public pure override returns(string memory) {
   |                       ^^^^^^^^^^^^


Successfully submitted source code for contract
contracts/test/basicNft.sol:BasicNft at 0x83173a154693a7062D9899Ff9e10F4ec18834e8A
for verification on the block explorer. Waiting for verification result...

Successfully verified contract BasicNft on Etherscan.
https://rinkeby.etherscan.io/address/0x83173a154693a7062D9899Ff9e10F4ec18834e8A#code
Updating frontend...
```
