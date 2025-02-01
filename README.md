# Deploy First Smart Contract — Hardhat Project

This repository demonstrates how to set up a Hardhat project and deploy the **VotingSystem** smart contract on Metis Sepolia/Andromeda. It also covers some common troubleshooting steps regarding ethers v5 vs. v6 usage in Hardhat.

---
## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn** (for dependency management)
- **Git** (optional but recommended)
- Basic knowledge of Solidity, Hardhat, and blockchain development

---

## Step 1: Create a New Hardhat Project
1. **Create and move into a project folder**:
   ```bash
   mkdir voting-system
   cd voting-system

2. **Create and move into a project folder**:
   ```bash
   npm init -y

3. **Install Hardhat:**:
   ```bash
   npm install --save-dev hardhat

4. **Create a Hardhat project**:
   ```bash
   npx hardhat

When prompted, select “Create an empty hardhat.config.js” or any other template you prefer.

---

## Step 2: Project Structure

Your folder structure should look like this after creating the Hardhat project:

```plaintext
voting-system
├── contracts
│   └── vote.sol        <-- Replace this with your VotingSystem contract code
├── scripts
│   └── deploy.js       <-- Script to deploy the smart contract
├── hardhat.config.js   <-- Configuration for the Hardhat project
├── package.json        <-- Project metadata and dependencies
└── README.md           <-- Project documentation (this file)
```
---

## Step 3: Replace or Create the `vote.sol` Contract

1. Navigate to the `contracts` folder in your project directory.
2. Create a new file named `vote.sol` or replace the existing one.
3. Copy and paste the following Solidity code into the file:

   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   contract VotingSystem {
       struct Candidate {
           string name;
           uint voteCount;
       }

       mapping(address => bool) public voters;
       Candidate[] public candidates;

       constructor(string[] memory candidateNames) {
           for (uint i = 0; i < candidateNames.length; i++) {
               candidates.push(Candidate(candidateNames[i], 0));
           }
       }

       function vote(uint candidateIndex) public {
           require(!voters[msg.sender], "You have already voted.");
           require(candidateIndex < candidates.length, "Invalid candidate index.");

           voters[msg.sender] = true;
           candidates[candidateIndex].voteCount++;
       }

       function getCandidates() public view returns (Candidate[] memory) {
           return candidates;
       }
   }

---

## Step 4: Create the `deploy.js` Script

1. Navigate to the `scripts` folder in your project directory.
2. Create a new file named `deploy.js`.
3. Copy and paste the following JavaScript code into the file:

```javascript
const hre = require("hardhat");

async function main() {
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");

  // Pass the candidate names as an array of strings
  const candidateNames = ["Alice", "Bob", "Charlie"]; // Replace these with your desired candidate names
  const votingSystem = await VotingSystem.deploy(candidateNames);

  console.log("Deploying VotingSystem...");
  await votingSystem.waitForDeployment();

  console.log(`VotingSystem deployed to: ${votingSystem.target}`);
}

// Catch and handle errors during deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
---

## Step 5: Install Remaining Dependencies

If you haven’t installed the Hardhat toolbox or ethers.js yet, you can install them manually using the following commands:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev @nomiclabs/hardhat-ethers
npm install --save-dev ethers

```
---

## Step 6: Configure `hardhat.config.js` for Metis deployment

1. Open or create the `hardhat.config.js` file in your project’s root directory.

2. Update the file to include the following content:

   ```javascript
    require("@nomicfoundation/hardhat-toolbox");
    require("@nomicfoundation/hardhat-verify");
    require("dotenv").config();

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const METIS_SEPOLIA_RPC_URL = process.env.RPC_URL; // Replace this with the Metis Sepolia RPC URL

    module.exports = {
    solidity: "0.8.28",
    networks: {
        metisSepolia: {
        url: METIS_SEPOLIA_RPC_URL,
        accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        chainId: 59902,
        },
    },
    etherscan: {
      apiKey: {
      metisSepolia: "any-non-empty-string", 
      //Metis doesn't require an API key for verication. You can use any non-empty string as a placeholder.
    },
    customChains: [
      {
        network: "metisSepolia",
        chainId: 59902,
        urls: {
          apiURL: "https://sepolia-explorer-api.metisdevops.link/api",
          browserURL: "https://sepolia-explorer.metisdevops.link",
        },
      },
    ],
    }
    };
    
   ```
   In the above example we used the Metis Sepolia test network and a `.js` file. [More info on using typescript with hardhat available here](https://hardhat.org/guides/typescript.html#typescript-support).

### Configure .env File for Private Key and RPC URL
1. **Install dotenv: Install the dotenv package to handle environment variables**
``` bash 
npm install dotenv
```

2. **Create a .env file: At the root of your project, create a new file named .env. Add the following contents**
``` bash 
PRIVATE_KEY=your_private_key
RPC_URL=https://sepolia.metisdevops.link
```
Replace your_private_key with your wallet’s private key and RPC_URL with the RPC endpoint of your chosen network.

3. **Update .gitignore: Ensure the .env file is ignored by Git by adding it to your .gitignore file:**
``` bash 
.env
```

---

## Step 7. Compile and Deploy
1. Compile the contracts:
```bash
npx hardhat compile
```

2. Deploy the VotingSystem contract:
```bash
npx hardhat run scripts/deploy.js --network metisSepolia
```
Replace metis with the actual network name from your hardhat.config.js. If deploying locally, you can omit --network ... to use the default local environment.

## Step 8. Verifying the Deployment
• Local Network: By default, Hardhat uses a local network. You can see the contract deployed in your terminal logs, or connect via Hardhat’s console to interact with it.

• Testnet/Mainnet: Once deployed, you should see a transaction hash. You can verify your contract on Metis Blockchain using the following Hardhat command:

```bash
npx hardhat verify --network metisSepolia <DEPLOYED_CONTRACT_ADDRESS>
```
Replace  `<DEPLOYED_CONTRACT_ADDRESS>` with the actual address of your deployed contract, and check it on the Metis block explorer. Scroll down to see verified status. A green checkmark ✅ means the contract is verified.

## Step 9. Common Troubleshooting (Ethers v5 vs. v6)
• Error: votingSystem.target is undefined
This typically means you are using ethers v5 but the code snippet is for ethers v6. Switch to votingSystem.address to fix it.

• Error: votingSystem.address is undefined
This typically means you are using ethers v6 but the code snippet is for ethers v5. Switch to votingSystem.target.

• No matching version of ethers found
Make sure your package versions are compatible. Install a specific version if needed:

```bash
    npm install ethers@6
    npm install ethers@5
```
• Hardhat configuration issues
Make sure your hardhat.config.js is properly set up, and you have the right RPC URL and a funded account.
