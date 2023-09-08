import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  //   const SCIFactory = await ethers.getContractFactory("SCI");
  //   const sci = await SCIFactory.deploy();
  //   await sci.deployed();
  //   console.log("SCI deployed to:", sci.address);

  const NFTFactory = await ethers.getContractFactory("NFT");
  const nft = await NFTFactory.deploy("Book", "BK");
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
  // const MarketFactory = await ethers.getContractFactory("Market");
  // const market = await MarketFactory.deploy();
  // await market.deployed();
  // console.log("Market deployed to:", market.address);
}

main();
