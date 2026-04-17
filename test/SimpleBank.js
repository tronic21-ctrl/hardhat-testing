const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SimpleBank", function() {

    async function deploySimpleBankFixture() {
        const signers = await ethers.getSigners();
        const owner = signers[0];
        const user1 = signers[1];
        const SimpleBank = await ethers.getContractFactory("SimpleBank");
        const bank = await SimpleBank.deploy();
        return { bank, owner, user1 };
    }

    it("should increase balance after deposit", async function() {
        const { bank, user1 } = await loadFixture(deploySimpleBankFixture);

        await bank.connect(user1).deposit({ value: ethers.parseEther("0.1") });

        const balance = await bank.connect(user1).getBalance();
        expect(balance).to.equal(ethers.parseEther("0.1"));
    });

    it("should revert if deposit 0 ETH", async function() {
        const { bank, user1 } = await loadFixture(deploySimpleBankFixture);

        await expect(
            bank.connect(user1).deposit({ value:0 })
            ).to.be.revertedWith("Harus deposit lebih dari 0")
        });

    it("should decrease balance after withdraw", async function() {
        const { bank, user1 } = await loadFixture(deploySimpleBankFixture);

        await bank.connect(user1).deposit({ value: ethers.parseEther("1.0")});
        await bank.connect(user1).withdraw(ethers.parseEther("0.5"));

        const balance = await bank.connect(user1).getBalance();
        expect(balance).to.equal(ethers.parseEther("0.5"));
        });

    it("should revert if withdraw exceeds balance", async function() {
        const { bank, user1 } = await loadFixture(deploySimpleBankFixture);

        await bank.connect(user1).deposit({ value : ethers.parseEther("0.1") });

        await expect(
            bank.connect(user1).withdraw(ethers.parseEther("2.0"))
        ).to.be.revertedWith("Saldo tidak cukup");
        });
    });