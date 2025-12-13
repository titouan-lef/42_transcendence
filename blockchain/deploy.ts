import { ethers } from "hardhat";

async function main() {
  // L'objet `ethers` est fourni par Hardhat et utilise le premier compte
  // configuré dans votre network (ou le compte par défaut pour hardhat/localhost).
  const [deployer] = await ethers.getSigners();

  console.log("Déploiement du contrat avec le compte :", deployer.address);
  
  // Obtenir la Factory du contrat. Le nom doit correspondre au nom du contrat Solidity.
  const EloStorage = await ethers.getContractFactory("EloStorage");

  // Déploiement :
  // Les parenthèses vides () sont utilisées car votre constructeur n'accepte aucun argument.
  const eloStorage = await EloStorage.deploy();

  // Attendre que la transaction de déploiement soit minée (confirmée)
  await eloStorage.waitForDeployment();

  const contractAddress = await eloStorage.getAddress();

  console.log(`Contrat EloStorage déployé à l'adresse: ${contractAddress}`);
}

// Nous utilisons un pattern standard pour gérer les erreurs et le statut de sortie.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

