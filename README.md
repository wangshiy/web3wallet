# Web3Wallet Demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/5293ffa1-7a1b-4c7c-b8a9-75d59dbf5d6c/deploy-status?branch=main)](https://app.netlify.com/sites/web3wallet-demo/deploys)

- website: https://web3wallet-demo.netlify.app/
- network: Goerli
- alchemy: https://dashboard.alchemyapi.io/apps/dyfch0p05i8ecmpg, contract deployment
- netlify: https://app.netlify.com/sites/web3wallet-demo/overview, web hosting
- goerlifaucet: https://goerlifaucet.com/, get test goerli eth

## How to develop

### Contract

```javascript
cd contract
yarn
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
// npx hardhat run scripts/deploy.js --network goerli // if you want to deploy to live goerli network
npx hardhat --network localhost faucet <your address>
```

### Website

```javascript
cd website
yarn
yarn start
```