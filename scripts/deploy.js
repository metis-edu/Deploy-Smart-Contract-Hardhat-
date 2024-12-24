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