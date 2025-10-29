import { expect } from "chai";
import { ethers } from "hardhat";

describe("EloStorage", () => {
  const username1 = "ael-atmi";
  const username2 = "tilegran";
  const username3 = "tle-floc";
  const username4 = "lguerbig";
  const username5 = "pchalmin";

  it("set/get/update ELO", async function () {
    const Elo = await ethers.getContractFactory("EloStorage");
    const elo = await Elo.deploy();
    await elo.waitForDeployment();

    await elo.setElo(username1, 1, 1200);
    expect(await elo.getElo(username1, 1)).to.equal(1200);

    await elo.setElo(username2, 1, 1200);
    expect(await elo.getElo(username2, 1)).to.equal(1200);

    await elo.setElo(username3, 1, 1200);
    expect(await elo.getElo(username3, 1)).to.equal(1200);

    await elo.setElo(username4, 1, 1200);
    expect(await elo.getElo(username4, 1)).to.equal(1200);

    await elo.setElo(username5, 1, 1200);
    expect(await elo.getElo(username5, 1)).to.equal(1200);

    await elo.updateElo(username1, 1, 100);
    expect(await elo.getElo(username1, 1)).to.equal(1300);

    await elo.updateElo(username2, 1, -1500);
    expect(await elo.getElo(username2, 1)).to.equal(1);

    await elo.updateElo(username3, 1, -100);
    expect(await elo.getElo(username3, 1)).to.equal(1100);

    await elo.updateElo(username4, 1, 1000);
    expect(await elo.getElo(username4, 1)).to.equal(2200);

    expect(await elo.getElo("pl", 1)).to.equal(0);
  });
});
