require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const METIS_SEPOLIA_RPC_URL = process.env.METIS_SEPOLIA_RPC_URL; // Replace this with the Metis Sepolia RPC URL

module.exports = {
  solidity: "0.8.28",
  networks: {
    metisSepolia: {
      url: METIS_SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 59902,
    },
  },
};