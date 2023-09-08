import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useMemo } from "react";
import ModalTransactionContext, {
  defaultTxResult,
} from "../contexts/modal-transaction";

const ModalTransactionComponent = () => {
  const {
    isOpen,
    onClose = () => {},
    txResult,
    setTxResult,
  } = useContext(ModalTransactionContext);

  const handleTxState = useMemo(() => {
    switch (txResult.txState) {
      case "pending":
        return (
          <>
            <ModalHeader>Transaction processing</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Spinner color="green.500" />
            </ModalBody>
          </>
        );
      case "process":
        return (
          <>
            <ModalHeader>Transaction processing</ModalHeader>
            <ModalCloseButton />
            {txResult.content.map((item, index) => (
              <ModalBody key={index}>
                <Text fontWeight="bold">{item.title}</Text>
                <Text color={"green"} fontSize={"sm"}>
                  {item.value}
                </Text>
              </ModalBody>
            ))}
          </>
        );
      case "success":
        return (
          <>
            <ModalHeader>Transaction success</ModalHeader>
            <ModalCloseButton />
            {txResult.content.map((item, index) => (
              <ModalBody key={index}>
                <Text fontWeight="bold">{item.title}</Text>
                <Text color={"green"} fontSize={"sm"}>
                  {item.value}
                </Text>
              </ModalBody>
            ))}
          </>
        );
      case "error":
        return (
          <>
            <ModalHeader>Transaction error</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Reason: {txResult.reason}</Text>
            </ModalBody>
          </>
        );

      default:
        break;
    }
  }, [txResult.txState, txResult.content, txResult.reason]);

  useEffect(() => {
    if (!!isOpen) clearTxResult();
  }, [!!isOpen]);

  const clearTxResult = useCallback(() => {
    setTxResult(defaultTxResult);
  }, [setTxResult]);
  return (
    <Modal
      isCentered
      isOpen={!!isOpen}
      closeOnOverlayClick={txResult.txState != "pending"}
      onClose={() => {
        onClose();
        clearTxResult();
      }}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        {handleTxState}
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const useModalTransaction = () => {
  return useContext(ModalTransactionContext);
};
export { useModalTransaction };
export default ModalTransactionComponent;
