import { action, createStore } from "easy-peasy";
import StoreModel from "./model";

const store = createStore<StoreModel>({
  user: {
    data: undefined,
    setData: action((state, payload) => {
      state.data = payload;
    }),
    isCheckConnectData: {
      isCheckConnect: false,
    },
    setIsCheckConnect: action((state, payload) => {
      state.isCheckConnectData = payload;
    }),
  },
});

export default store;
