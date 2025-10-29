import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xFC62402D776fEF6C4eCA7e9D790651761300ac79";
  const username = "pl";

  const [signer] = await ethers.getSigners();
  const Elo = await ethers.getContractFactory("EloStorage");
  const elo = Elo.attach(contractAddress).connect(signer);

  let tx = await elo.setElo(username, 1, 1200);
  await tx.wait();
  console.log("ELO set to 1200 for season 1");

  tx = await elo.updateElo(username, 1, 50);
  await tx.wait();
  console.log("ELO updated by +50 for season 1");

  const currentElo = await elo.getElo(username, 1);
  console.log("Current ELO:", currentElo.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
