import { ethers } from "hardhat";

async function main(): Promise<void> {
	const eloContract = await ethers.getContractFactory("EloStorage");
	const elo = await eloContract.deploy();
	await elo.waitForDeployment();
	console.log("✅ EloStorage deployed at:", await elo.getAddress());
}

main().catch((e) => {
	console.error(e);
	process.exitCode = 1;
});
