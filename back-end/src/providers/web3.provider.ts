import { ABI_NFT } from '@constants';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types/index';

const web3 = new Web3(`${process.env.NETWORK_RPC}`);

const newContract = (abi: any, address: string): Contract => {
  return new web3.eth.Contract(abi, address);
};

const getBlockByNumber = async (blockNumber: number) => {
  return await web3.eth.getBlock(blockNumber);
};

const nftContract = newContract(ABI_NFT.NFT.abi, ABI_NFT.NFT.address);

export { web3, newContract, nftContract, getBlockByNumber };
