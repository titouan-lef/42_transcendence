import { ethers } from "hardhat";

async function main() {
  const Elo = await ethers.getContractFactory("EloStorage");
  const elo = await Elo.deploy();
  await elo.waitForDeployment();
  console.log("✅ EloStorage deployed at:", await elo.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
