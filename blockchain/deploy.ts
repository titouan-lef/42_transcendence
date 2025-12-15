import { ethers } from "hardhat";

async function main() {

	const [deployer] = await ethers.getSigners();
	console.log("Deployment of the contract with the account:", deployer.address);

	const EloStorage = await ethers.getContractFactory("EloStorage");


	const eloStorage = await EloStorage.deploy();

	await eloStorage.waitForDeployment();

	const contractAddress = await eloStorage.getAddress();

	console.log(`EloStorage contract deployed at the address: ${contractAddress}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
