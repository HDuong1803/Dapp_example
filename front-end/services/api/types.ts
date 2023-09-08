import { ContractInterface } from "ethers";
import { AbiItem } from "web3-utils";
interface ERC20Input {
  name: string;
  symbol: string;
  initial_supply: number;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
}
interface ERC721Input {
  name: string;
  symbol: string;
  baseURI: string;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
  is_uri_storage: boolean;
}
interface ERC1155Input {
  name: string;
  uri: string;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
  is_updatable_uri: boolean;
}
interface TokenCreatorOutput {
  bytecode: string;
  name: string;
  uuid: string;
  abi: ContractInterface;
}
interface VerifyInput {
  uuid: string;
  name: string;
  address: string;
}
interface GetAbiInput {
  address: string;
}

interface GetAbiOutput {
  abi: AbiItem[];
}

interface SubmitPrivateKeyInput {
  privateKey: string;
  address: string;
}
interface GetPrivateKeyInput {
  address: string;
}

interface GetPrivateKeyOutput {
  privateKey: string;
}

interface GetStealthAddressOutput {
  address: string;
  from: string;
}

interface GetUserOutput {
  wallet_address: string;
  name: string;
  avatar: string;
  description: string;
  private_key: string;
  stealth_address: {
    address: string;
    from: string;
  }[];
  ids: string[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

interface RentMarketInput {
  fee_percentage: string;
  admin_wallet: string;
  token_address: string;
  is_updatable_fee: boolean;
  is_updatable_admin: boolean;
}

export type {
  ERC20Input,
  TokenCreatorOutput,
  VerifyInput,
  ERC721Input,
  ERC1155Input,
  GetAbiInput,
  GetAbiOutput,
  SubmitPrivateKeyInput,
  GetPrivateKeyInput,
  GetPrivateKeyOutput,
  GetStealthAddressOutput,
  GetUserOutput,
  RentMarketInput,
};
