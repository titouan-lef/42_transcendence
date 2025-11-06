import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS!;
  const EloStorage = await ethers.getContractFactory("EloStorage");
  const contract = EloStorage.attach(contractAddress);

  const season = 1;
  const players = ["ael-atmi", "tilegran", "lguerbig", "tle-floc", "pchalmin"];

  console.log(`🏁 Season ${season}`);
  for (const username of players) {
    const elo = await contract.getElo(username, season);
    console.log(`${username}: ${elo.toString()}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
