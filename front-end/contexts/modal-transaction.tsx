import { useDisclosure, UseDisclosureProps } from "@chakra-ui/react";
import React from "react";
import ModalTransactionComponent from "../components/modal-transaction";
type TxStateProps = "pending" | "process" | "success" | "error";

export interface TxResultProps {
  content: {
    title: string;
    value: any;
  }[];
  reason?: string;
  receipt?: any;
  txState?: TxStateProps;
}
export const defaultTxResult: TxResultProps = {
  content: [],
  reason: "",
  receipt: {},
  txState: "pending",
};
const ModalTransactionContext = React.createContext<
  UseDisclosureProps & {
    txResult: TxResultProps;
    setTxResult: (
      value: TxResultProps | ((prev: TxResultProps) => TxResultProps)
    ) => void;
  }
>({
  txResult: defaultTxResult,
  setTxResult: () => {},
});
export const ModalTransactionProvider = ({ children }: { children: any }) => {
  const disclosure = useDisclosure();
  const [txResult, setTxResult] =
    React.useState<TxResultProps>(defaultTxResult);
  return (
    <ModalTransactionContext.Provider
      value={{
        ...disclosure,
        txResult,
        setTxResult: (
          value: TxResultProps | ((prev: TxResultProps) => TxResultProps)
        ) => {
          if (typeof value === "function") {
            setTxResult((prev) => ({ ...prev, ...value(prev) }));
          } else {
            setTxResult((prev) => ({ ...prev, ...value }));
          }
        },
      }}
    >
      {children}
      <ModalTransactionComponent />
    </ModalTransactionContext.Provider>
  );
};
export default ModalTransactionContext;
