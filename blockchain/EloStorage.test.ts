import { expect } from "chai";
import { ethers } from "hardhat";

describe("EloStorage", function () {
	let elo: any;
	const season = 1;
	const users: string[] = ["ael-atmi", "tilegran", "tle-floc", "lguerbig", "pchalmin"];
	const users1: string[] = ["ael-atmi", "tilegran", "tle-floc", "lguerbig", "pchalmin", "coucou"];
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

		await elo.setRatingDeviation("tilegran", season, 250);
		const [ratingT, ratingDeviationT] = await elo.getEloData("tilegran", season);
		expect(ratingT).to.equal(1200);
		expect(ratingDeviationT).to.equal(250);
		
		
		const tab: number[] = await elo.getAllRatingBySeason(users, season);
		expect(tab[0]).to.equal(1200);
		expect(tab[1]).to.equal(1200);
		expect(tab[2]).to.equal(1200);
		expect(tab[3]).to.equal(1200);
		expect(tab[4]).to.equal(1200);
		
		const tab1: number[] = await elo.getAllRatingBySeason(users1, season);
		expect(tab1[0]).to.equal(1200);
		expect(tab1[1]).to.equal(1200);
		expect(tab1[2]).to.equal(1200);
		expect(tab1[3]).to.equal(1200);
		expect(tab1[4]).to.equal(1200);
		expect(tab1[5]).to.equal(0);		
	});


	it("should return default 0 for unknown users", async function () {
		const [rating, ratingDeviation]= await elo.getEloData("unknown", season);
		expect(rating).to.equal(0);
		expect(ratingDeviation).to.equal(0);
	});
});
