import { Action } from "easy-peasy";
import { GetUserOutput } from "../api/types";

interface User {
  data: GetUserOutput | undefined;
  setData: Action<User, GetUserOutput | undefined>;
  isCheckConnectData: {
    isCheckConnect: boolean;
    callback?: (...args: any) => any;
    args?: any;
  };
  setIsCheckConnect: Action<
    User,
    {
      isCheckConnect: boolean;
      callback?: (...args: any) => any;
      args?: any;
    }
  >;
}

interface StoreModel {
  user: User;
}

export default StoreModel;
