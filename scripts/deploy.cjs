const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy Token
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // Deploy Faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy();
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // Wire contracts
  await faucet.setToken(tokenAddress);
  await token.setMinter(faucetAddress, true);

  console.log("Faucet authorized as minter");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
