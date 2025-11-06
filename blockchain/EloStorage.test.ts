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

  it("set/get/update ELO for multiple users", async function () {
    for (const u of users) {
      await elo.setElo(u, season, 1200);
      const val = await elo.getElo(u, season);
      expect(val).to.equal(1200);
    }

    await elo.updateElo("ael-atmi", season, 100);
    expect(await elo.getElo("ael-atmi", season)).to.equal(1300);

    await elo.updateElo("tilegran", season, -1500);
    expect(await elo.getElo("tilegran", season)).to.equal(1);

    await elo.updateElo("tle-floc", season, -100);
    expect(await elo.getElo("tle-floc", season)).to.equal(1100);

    await elo.updateElo("lguerbig", season, 1000);
    expect(await elo.getElo("lguerbig", season)).to.equal(2200);

    expect(await elo.getElo("unknown", season)).to.equal(0);
  });
});
