import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const [signer] = await ethers.getSigners();

  const EloStorage = await ethers.getContractFactory("EloStorage");
  const contract = EloStorage.attach(contractAddress);

  const username = "ael-atmi";
  const season = 1;

  const elo = await contract.getElo(username, season);
  console.log(`🏆 ELO de ${username} (saison ${season}) = ${elo.toString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
