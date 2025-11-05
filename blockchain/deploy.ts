import { ethers } from "hardhat";

async function main() {
  const EloFactory = await ethers.getContractFactory("EloStorage");
  const elo = await EloFactory.deploy();

  // ethers v6 : l'adresse est disponible directement
  console.log("EloStorage deployed to:", elo.target); // ⚡ ou .address selon version
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

