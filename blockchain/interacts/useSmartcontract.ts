import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

	const contractAddress: string = process.env.CONTRACT_ADDRESS!;
	const [signer] = await ethers.getSigners();
	const contract = await ethers.getContractAt("EloStorage", contractAddress, signer);

	// Read rating and rating_rd
	async function getElo(username: string, season: number) {
		const [rating, ratingRd] = await contract.getEloData(username, season);
		console.log(`Elo of ${username}, saison ${season}: rating = ${rating}, ratingRd = ${ratingRd}`);
	return { rating, ratingRd };
	}

	// Update of both
	async function setEloData(username: string, season: number, rating: number, ratingRd: number) {
		const tx = await contract.setEloData(username, season, rating, ratingRd);
		await tx.wait();
		console.log(`EloData is updated for ${username}, saison ${season}`);
	}

	// Update Rating
	async function setRating(username: string, season: number, rating: number) {
		const tx = await contract.setRating(username, season, rating);
		await tx.wait();
		console.log(`Rating is updated for ${username} à ${rating}`);
	}

	// Update RatingRd
	async function setRatingRd(username: string, season: number, ratingRd: number) {
		const tx = await contract.setRatingRd(username, season, ratingRd);
		await tx.wait();
		console.log(`RatingRd is updated for ${username} à ${ratingRd}`);
	}

	// Test
	const username = "tle-floc";
	const season = 2024;

	await setEloData(username, season, 1500, 200);
	await getElo(username, season);

	await setRating(username, season, 1600);
	await getElo(username, season);

	await setRatingRd(username, season, 180);
	await getElo(username, season);
}

// Exécuter le script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});