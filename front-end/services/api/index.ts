import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ERC20Input,
  TokenCreatorOutput,
  ERC721Input,
  VerifyInput,
  ERC1155Input,
  GetAbiInput,
  GetAbiOutput,
  GetPrivateKeyOutput,
  GetStealthAddressOutput,
  GetUserOutput,
  RentMarketInput,
} from "./types";
type SuccessResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  total: number;
};
const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001"
    : "https://api.scimta.com";

const axios = new Axios({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [(data) => JSON.parse(data)],
  transformRequest: [
    (data, headers) => {
      if (headers && headers["Content-Type"] == "application/json") {
        return JSON.stringify(data);
      }
      return data;
    },
  ],
});

axios.interceptors.request.use((config) => {
  if (config.headers) {
    try {
      config.headers["authorize"] = `Music protocol:${localStorage.getItem(
        "signature"
      )}`;
    } catch (error: any) {}
  }
  return config;
});

const AxiosPost = <O>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(
    url,
    data,
    config
  );
};

const AxiosGet = <O>(url: string, config?: AxiosRequestConfig) =>
  axios.get<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(url, config);

const ApiServices = {
  tokenCreator: {
    erc20: (payload: ERC20Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc20", payload),
    erc721: (payload: ERC721Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc721", payload),
    erc1155: (payload: ERC1155Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc1155", payload),
    verify: (payload: VerifyInput) =>
      AxiosPost<boolean>("/token-creator/verify-contract", payload),
    abi: (payload: GetAbiInput) =>
      AxiosGet<GetAbiOutput>("/token-creator/abi", {
        params: payload,
      }),
  },
  stealthAddress: {
    submitPrivateKey: (privateKey: string, address: string) =>
      AxiosPost<boolean>("/stealth-address/submit-private-key", {
        privateKey,
        address,
      }),
    submitStealthAddress: (
      wallet_address: string,
      address: string,
      from: string
    ) =>
      AxiosPost<boolean>("/stealth-address/submit-stealth-address", {
        wallet_address,
        address,
        from,
      }),
    getPrivateKey: (address: string) =>
      AxiosGet<GetPrivateKeyOutput>("/stealth-address/get-private-key", {
        params: { address },
      }),
    getStealthAddress: (address: string) =>
      AxiosGet<GetStealthAddressOutput[]>(
        "/stealth-address/get-list-stealth-address",
        {
          params: { address },
        }
      ),
  },
  renting: {
    erc4907: (payload: ERC721Input) =>
      AxiosPost<TokenCreatorOutput>("renting/erc4907", payload),
    rentMarket: (payload: RentMarketInput) =>
      AxiosPost<TokenCreatorOutput>("renting/rent-market", payload),
  },
  user: {
    getUser: (address: string) =>
      AxiosGet<GetUserOutput>("/user/get-user", {
        params: {
          address,
        },
      }),
    createUser: (payload: any) =>
      AxiosPost<GetUserOutput>("/user/create-user", payload),
  },
  ipfs: {
    uploadImage: (payload: any) =>
      AxiosPost<string>("/ipfs/upload-image", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    uploadJson: (payload: any) =>
      AxiosPost<string>("/ipfs/upload-json", payload),
  },
};

export default ApiServices;
