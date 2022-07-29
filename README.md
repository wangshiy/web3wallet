# Intro

# Contract

```javascript
cd contract
yarn
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat --network localhost faucet <your address>
// make sure Metamask is listening to http:127.0.0.1:8545
// register alchemy: https://dashboard.alchemyapi.io/
// get test goerli eth : https://goerlifaucet.com/
```

# Website

```javascript
cd website
yarn
yarn start
```