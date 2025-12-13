import { expect } from "chai";
import { ethers } from "hardhat";

describe("EloStorage", function () {
	let elo: any;
	const season = 1;
	const users = ["ael-atmi", "tilegran", "tle-floc", "lguerbig", "pchalmin"];

	beforeEach(async function () {
		const EloFactory = await ethers.getContractFactory("EloStorage");
		elo = await EloFactory.deploy();
	});

	it("should set and get ELO data for multiple users", async function () {
		for (const u of users) {
			await elo.setEloData(u, season, 1200, 200);
			const [rating, ratingDeviation] = await elo.getEloData(u, season);
			expect(rating).to.equal(1200);
			expect(ratingDeviation).to.equal(200);
		}

		await elo.setRating("ael-atmi", season, 1300);
		const [ratingA, ratingDeviationA] = await elo.getEloData("ael-atmi", season);
		expect(ratingA).to.equal(1300);
		expect(ratingDeviationA).to.equal(200);

		await elo.setRatingDeviation("tilegran", season, 250);
		const [ratingT, ratingDeviationT] = await elo.getEloData("tilegran", season);
		expect(ratingT).to.equal(1200);
		expect(ratingDeviationT).to.equal(250);
	});

	it("should return default 0 for unknown users", async function () {
		const [rating, ratingDeviation]= await elo.getEloData("unknown", season);
		expect(rating).to.equal(0);
		expect(ratingDeviation).to.equal(0);
	});
});
