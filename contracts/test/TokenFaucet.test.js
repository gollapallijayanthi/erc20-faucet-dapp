const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Faucet", function () {
  let token, faucet;
  let owner, user1, user2;

  const FAUCET_AMOUNT = ethers.parseEther("100");
  const DAY = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("FaucetToken");
    const Faucet = await ethers.getContractFactory("TokenFaucet");

    faucet = await Faucet.deploy();
    await faucet.waitForDeployment();

    token = await Token.deploy(await faucet.getAddress());
    await token.waitForDeployment();

    await faucet.setToken(await token.getAddress());
  });

  it("allows user to claim tokens", async function () {
    await faucet.connect(user1).requestTokens();
    const bal = await token.balanceOf(user1.address);
    expect(bal).to.equal(FAUCET_AMOUNT);
  });

  it("enforces 24 hour cooldown", async function () {
    await faucet.connect(user1).requestTokens();
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Cooldown period not elapsed");
  });

  it("allows claim after cooldown", async function () {
    await faucet.connect(user1).requestTokens();
    await ethers.provider.send("evm_increaseTime", [DAY]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
    const bal = await token.balanceOf(user1.address);
    expect(bal).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("enforces lifetime limit", async function () {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [DAY]);
      await ethers.provider.send("evm_mine");
    }

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Lifetime claim limit reached");
  });

  it("allows multiple users independently", async function () {
    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
    expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
  });

  it("admin can pause faucet", async function () {
    await faucet.setPaused(true);
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });

  it("non-admin cannot pause", async function () {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin can pause");
  });
});
