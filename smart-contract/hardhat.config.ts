import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.NETWORK_RPC,
      accounts: [`${PRIVATE_KEY}`],
    },
    mumbai: {
      url: process.env.NETWORK_RPC,
      accounts: [`${PRIVATE_KEY}`],
    },
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: API_KEY,
  },
};
