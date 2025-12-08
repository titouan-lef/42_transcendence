import { ethers } from "hardhat";

async function main() {
	/** The `ethers` object is provided by Hardhat and uses the first account
	configured in your network (or the default account for hardhat/localhost). */
	const [deployer] = await ethers.getSigners();

	 console.log("Déploiement du contrat avec le compte :", deployer.address);

	/** Obtain the Factory for the contract. The name must match the Solidity contract name. */
	const EloStorage = await ethers.getContractFactory("EloStorage");

	/** Deployment:
	 * Empty parentheses () are used because your constructor does not accept any arguments. */
	const eloStorage = await EloStorage.deploy();

	/** Wait for the deployment transaction to be mined (confirmed) */
	await eloStorage.waitForDeployment();

	const contractAddress = await eloStorage.getAddress();

	console.log(`Contrat EloStorage déployé à l'adresse: ${contractAddress}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

