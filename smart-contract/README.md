# Project information

- Node version: v16.17.0
- NPM version: v8.15.0
- Yarn version: v1.22.17

# Setup environment

- Install Node.js
- Install Yarn: `npm install -g yarn`
- Install dependencies: `yarn install`
- Create `.env` file from `.env.example` and fill in the values

`.env` file:

```bash
NETWORK_RPC=YOUR_RPC_URL
API_KEY=YOUR_ETHERSCAN_API_KEY
PRIVATE_KEY=PRIVATE_KEY_OF_DEPLOYER
```

# Deploy smart contracts

## Music contract

- Deploy contract: `yarn contract:deploy:music`
- Verify contract on scan: `yarn contract:verify ./abi-music.json`
