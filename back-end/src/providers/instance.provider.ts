import { NFTService } from '@app/nft/nft.service';
import { UserService } from '@app/user/user.service';

class Singleton {
  private static userInstance: UserService;
  private static nftInstance: NFTService;
  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService();
    }
    return Singleton.userInstance;
  }
  public static getNFTInstance(): NFTService {
    if (!Singleton.nftInstance) {
      Singleton.nftInstance = new NFTService();
    }
    return Singleton.nftInstance;
  }
}

export { Singleton };
