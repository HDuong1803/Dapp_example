import { User } from '@schemas';
import { CreateUserInput } from './user';

export class UserService {
  async createUser({ wallet_address, description, name, avatar }: CreateUserInput) {
    return await User.findOneAndUpdate(
      { wallet_address },
      {
        wallet_address,
        description,
        name: name || 'Unnamed',
        avatar,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async getUser(wallet_address: string) {
    return await User.findOneAndUpdate(
      { wallet_address },
      {},
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }
}
