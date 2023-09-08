import { logger } from '@constants';
import { NFT, Synchronize } from '@schemas';
import cron from 'node-cron';
import { EventData } from 'web3-eth-contract';
import { nftContract, web3 } from '.';

const globalVariable: any = global;

globalVariable.isSyncingGetDataFromSmartContract = false;
const onJobGetDataFromSmartContract = async () => {
  try {
    logger.info(
      'onJobGetDataFromSmartContract:' + globalVariable.isSyncingGetDataFromSmartContract,
    );
    if (globalVariable.isSyncingGetDataFromSmartContract) return;
    globalVariable.isSyncingGetDataFromSmartContract = true;
    const lastSynchronize = await Synchronize.findOne().sort({ last_block_number: -1 }).limit(1);
    const last_block_number = (lastSynchronize?.last_block_number || 0) + 1;

    if (!lastSynchronize?.last_block_number) {
      await Synchronize.create({
        last_block_number: 35649102,
      });
      globalVariable.isSyncingGetDataFromSmartContract = false;
      return;
    }
    const listTxHash: string[] = [];
    const last_block_number_onchain = Math.min(
      await web3.eth.getBlockNumber(),
      last_block_number + 100000,
    );
    logger.info(`Synchronizing from ${last_block_number} to ${last_block_number_onchain}`);
    await synchronizeNFT(last_block_number, last_block_number_onchain, listTxHash);
    if (listTxHash.length > 0) {
      await Synchronize.create({
        last_block_number: last_block_number_onchain,
        transactions: listTxHash,
      });
      logger.info(`Synchronized ${listTxHash.length} transactions`);
    } else {
      if (last_block_number_onchain - last_block_number > 500) {
        await Synchronize.create({
          last_block_number: last_block_number_onchain,
          transactions: [],
        });
      }
    }
  } catch (error: any) {
    logger.error(`onJobGetDataFromSmartContract: ${error.message}`);
  }
  globalVariable.isSyncingGetDataFromSmartContract = false;
};

const sortByTransactionIndex = (a: EventData, b: EventData) =>
  a.transactionIndex - b.transactionIndex;

const synchronizeNFT = async (
  last_block_number_sync: number,
  last_block_number_onchain: number,
  listTxHash: string[],
) => {
  const getPastEventsConfig = {
    fromBlock: last_block_number_sync,
    toBlock: last_block_number_onchain,
  };
  const eventTransfer = await nftContract.getPastEvents('Transfer', getPastEventsConfig);
  logger.info(`Synchronizing ${eventTransfer.length} transfer events`);

  const listTransfer = eventTransfer.sort(sortByTransactionIndex).map(e => ({
    from: e.returnValues['from'],
    to: e.returnValues['to'],
    tokenId: e.returnValues['tokenId'],
    transactionHash: e.transactionHash,
    blockNumber: e.blockNumber,
  }));

  listTxHash.push(...eventTransfer.map(e => e.transactionHash));

  for (const transferUpdate of listTransfer) {
    try {
      const uri = await nftContract.methods.tokenURI(transferUpdate.tokenId).call();

      await NFT.findOneAndUpdate(
        { token_id: transferUpdate.tokenId },
        {
          name: uri,
          image: '',
          description: '',
          owner: transferUpdate.to,
          updated_at: new Date(),
        },
        { upsert: true },
      );
    } catch (error: any) {
      logger.error(`Can not update nft: ${transferUpdate.tokenId}, error: ${error.message}`);
    }
  }
};

const startSynchronizeDataFromSmartContract = () => {
  cron.schedule('*/6 * * * * *', onJobGetDataFromSmartContract);
};

export { startSynchronizeDataFromSmartContract };
