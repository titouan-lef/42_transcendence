import { ethers } from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Déploiement du contrat avec le compte :", deployer.address);
  

  const EloStorage = await ethers.getContractFactory("EloStorage");


  const eloStorage = await EloStorage.deploy();

  await eloStorage.waitForDeployment();

  const contractAddress = await eloStorage.getAddress();

  console.log(`Contrat EloStorage déployé à l'adresse: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
