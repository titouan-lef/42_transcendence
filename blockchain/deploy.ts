import { ethers } from "hardhat";

async function main() {
  const EloFactory = await ethers.getContractFactory("EloStorage");
  const elo = await EloFactory.deploy();
  console.log("EloStorage deployed to:", elo.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

