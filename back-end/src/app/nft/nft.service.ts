import { NFT } from '@schemas';

export class NFTService {
  async getList() {
    return await NFT.find();
  }
}
