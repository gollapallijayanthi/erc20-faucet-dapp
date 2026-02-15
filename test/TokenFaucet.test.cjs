const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Faucet", function () {
  let token, faucet, owner, user;
  const FAUCET_AMOUNT = ethers.parseEther("100");
  const DAY = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy();
    await faucet.waitForDeployment();

    const Token = await ethers.getContractFactory("FaucetToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    await faucet.setToken(await token.getAddress());

    // 🔑 THIS IS THE KEY LINE YOU WERE MISSING
    await token.setMinter(await faucet.getAddress(), true);
  });

  it("should allow user to claim tokens", async function () {
    await faucet.connect(user).requestTokens();
    expect(await token.balanceOf(user.address)).to.equal(FAUCET_AMOUNT);
  });

  it("should enforce cooldown", async function () {
    await faucet.connect(user).requestTokens();
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Cooldown active");
  });

  it("should allow claim after cooldown", async function () {
    await faucet.connect(user).requestTokens();
    await ethers.provider.send("evm_increaseTime", [DAY]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user).requestTokens();
    expect(await token.balanceOf(user.address)).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("admin can pause faucet", async function () {
    await faucet.setPaused(true);
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Faucet paused");
  });
});
