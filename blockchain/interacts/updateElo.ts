import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const [signer] = await ethers.getSigners();

  const EloStorage = await ethers.getContractFactory("EloStorage");
  const contract = EloStorage.attach(contractAddress);

  const username = "pchalmin";
  const season = 1;
  const change = -150;

  const tx = await contract.updateElo(username, season, change);
  await tx.wait();

  const newElo = await contract.getElo(username, season);
  console.log(`⚡ Nouveau ELO de ${username} (saison ${season}) = ${newElo.toString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
