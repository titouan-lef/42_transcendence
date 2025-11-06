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
  const eloValue = 1300;

  const tx = await contract.setElo(username, season, eloValue);
  await tx.wait();

  console.log(`✅ ELO de ${username} défini à ${eloValue} pour la saison ${season}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
