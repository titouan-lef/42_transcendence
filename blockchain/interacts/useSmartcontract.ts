import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

	const contractAddress: string = process.env.CONTRACT_ADDRESS!;
	const [signer] = await ethers.getSigners();
	const contract = await ethers.getContractAt("EloStorage", contractAddress, signer);

	// Read rating and ratingDeviation
	async function getElo(username: string, season: number) {
		const [rating, ratingDeviation] = await contract.getEloData(username, season);
		console.log(`Elo of ${username}, season ${season}: rating = ${rating}, ratingDeviation = ${ratingDeviation}`);
	return { rating, ratingDeviation };
	}

	// Update of both
	async function setEloData(username: string, season: number, rating: number, ratingDeviation: number) {
		const tx = await contract.setEloData(username, season, rating, ratingDeviation);
		await tx.wait();
		console.log(`EloData is updated for ${username}, saison ${season}`);
	}

	// Update Rating
	async function setRating(username: string, season: number, rating: number) {
		const tx = await contract.setRating(username, season, rating);
		await tx.wait();
		console.log(`Rating is updated for ${username} à ${rating}`);
	}

	// Update RatingDeviation
	async function setRatingDeviation(username: string, season: number, ratingDeviation: number) {
		const tx = await contract.setRatingDeviation(username, season, ratingDeviation);
		await tx.wait();
		console.log(`RatingDeviation is updated for ${username} à ${ratingDeviation}`);
	}

	// Test
	const username = "tle-floc";
	const season = 2024;

	await setEloData(username, season, 1500, 200);
	await getElo(username, season);

	await setRating(username, season, 1600);
	await getElo(username, season);

	await setRatingDeviation(username, season, 180);
	await getElo(username, season);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
