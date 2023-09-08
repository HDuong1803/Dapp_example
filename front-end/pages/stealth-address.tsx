import {
  Box,
  Button,
  Center,
  Input,
  Skeleton,
  Stack,
  Text,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import _ from "lodash";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import LinkScan from "../components/link-scan";
import { useModalTransaction } from "../components/modal-transaction";
import { ABI_STEALTH_ADDRESS } from "../constants/abi";
import BaseLayout from "../layouts/base";
import ApiServices from "../services/api";
import { GetStealthAddressOutput } from "../services/api/types";
import { web3 } from "../services/thirdweb";

const StealthAddress: NextPage = () => {
  const [isLoading, setLoading] = useBoolean(true);
  const [publicKey, setPublicKey] = useState<string>("");
  const [privKey, setPrivKey] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [listStealthAddress, setListStealthAddress] = useState<
    (GetStealthAddressOutput & {
      balance: string;
    })[]
  >([]);
  const [stealthAddress, setStealthAddress] = useState<string>("");

  const connectedAddress = useAddress();
  const { onOpen, setTxResult } = useModalTransaction();

  const sdk = useSDK();
  const toast = useToast({
    containerStyle: {
      maxWidth: "200px",
    },
  });
  const getPublicKey = async () => {
    if (connectedAddress && sdk) {
      try {
        const address = await sdk.wallet.getAddress();
        setLoading.on();
        setPublicKey("");

        const res = await ApiServices.stealthAddress.getPrivateKey(address);
        if (res.data.data.privateKey) {
          setPrivKey(res.data.data.privateKey);
          const stealthAddressContract = await sdk.getContractFromAbi(
            ABI_STEALTH_ADDRESS.StealthAddress.address,
            ABI_STEALTH_ADDRESS.StealthAddress.abi
          );
          const pubKey = await stealthAddressContract.call("getPublicKey", [
            address,
          ]);
          const pubKeyXY = web3.utils.encodePacked(pubKey["X"], pubKey["Y"]);
          if (
            pubKeyXY &&
            web3.utils.hexToNumberString(pubKeyXY || "0x0") != "0"
          ) {
            setPublicKey(pubKeyXY);
          }
        }
      } catch (error) {
        console.error(`[stealth-address][getPublicKey]`, error);
      } finally {
        setLoading.off();
      }
    }
  };

  const generateKeyPair = async () => {
    if (sdk && connectedAddress) {
      try {
        const address = await sdk.wallet.getAddress();

        setLoading.on();
        const stealthAddressContract = await sdk.getContractFromAbi(
          ABI_STEALTH_ADDRESS.StealthAddress.address,
          ABI_STEALTH_ADDRESS.StealthAddress.abi
        );

        const { privateKey } = web3.eth.accounts.create();
        const [pubX, pubY] = await stealthAddressContract.call("privToPubKey", [
          privateKey,
        ]);
        await stealthAddressContract.call("setPublicKey", [pubX, pubY]);
        setPrivKey(privateKey);
        await ApiServices.stealthAddress.submitPrivateKey(privateKey, address);
      } catch (error) {
        console.error(`[stealth-address][generateKeyPair]`, error);
      } finally {
        getPublicKey();
      }
    }
  };

  const onChangeToAddress = async (e: any) => {
    setToAddress(e.target.value);
    setStealthAddress("");
    if (
      web3.utils.isAddress(e.target.value) &&
      sdk &&
      privKey &&
      connectedAddress
    ) {
      try {
        const stealthAddressContract = await sdk.getContractFromAbi(
          ABI_STEALTH_ADDRESS.StealthAddress.address,
          ABI_STEALTH_ADDRESS.StealthAddress.abi
        );
        const [stAddress] = await stealthAddressContract.call(
          "getStealthAddress",
          [privKey, e.target.value]
        );

        await ApiServices.stealthAddress.submitStealthAddress(
          e.target.value,
          stAddress,
          connectedAddress
        );
        setStealthAddress(stAddress);
      } catch (error) {
        setStealthAddress(`This address was not generate public key`);
      }
    }
  };

  const transferMatic = async () => {
    try {
      if (sdk && onOpen) {
        onOpen();
        const res = await sdk.wallet.transfer(stealthAddress, amount);
        setTxResult({
          reason: "",
          content: [
            {
              title: "Transaction Hash",
              value: <LinkScan transactionHash={res.receipt.transactionHash} />,
            },
          ],
          txState: "success",
        });
      }
    } catch (error: any) {
      setTxResult({
        reason: error?.data?.message ? error.data.message : error.message,
        content: [],
        txState: "error",
      });
    }
  };

  const getListStealthAddress = async () => {
    if (sdk && connectedAddress) {
      try {
        const address = await sdk.wallet.getAddress();
        setLoading.on();
        const res = await ApiServices.stealthAddress.getStealthAddress(address);
        const listStAddressWithBalance = await Promise.all(
          res.data.data.map(
            (item) =>
              new Promise((resolve) => {
                sdk.getBalance(item.address).then((balance) => {
                  resolve({
                    ...item,
                    balance: balance.displayValue,
                  });
                });
              })
          )
        );
        setListStealthAddress(listStAddressWithBalance as any);
      } catch (error) {
      } finally {
        setLoading.off();
      }
    }
  };

  const getPrivateKeyOfStealthAddress = async (
    address: string,
    from: string
  ) => {
    if (sdk && privKey) {
      try {
        const stealthAddressContract = await sdk.getContractFromAbi(
          ABI_STEALTH_ADDRESS.StealthAddress.address,
          ABI_STEALTH_ADDRESS.StealthAddress.abi
        );
        const [__, hashS] = await stealthAddressContract.call(
          "getStealthAddress",
          [privKey, from]
        );
        const privOfStealthAddress = await stealthAddressContract.call(
          "getPrivateKeyOfStealthAddress",
          [privKey, hashS]
        );
        toast({
          title: `Private key of Stealth Address:${address}`,
          description: privOfStealthAddress,
          status: "success",
          duration: 5000,
          position: "top-right",
        });
      } catch (error) {
        console.error(
          `[stealth-address][getPrivateKeyOfStealthAddress]`,
          error
        );
      }
    }
  };

  useEffect(() => {
    if (connectedAddress && sdk) {
      setToAddress("");
      setStealthAddress("");
      setAmount("");
      _.debounce(getPublicKey, 500)();
      _.debounce(getListStealthAddress, 500)();
    }
  }, [connectedAddress, sdk]);

  return (
    <BaseLayout selectTabIndex={5}>
      <Box boxShadow="lg" bg={"white"} borderRadius={5} p={5}>
        <Skeleton isLoaded={!isLoading}>
          <Stack direction={["column", "column", "row"]}>
            <Center>
              <Text overflowWrap="anywhere">Your public key: {publicKey}</Text>
            </Center>
            {(!publicKey || !privKey) && (
              <Button onClick={generateKeyPair} colorScheme="teal">
                Generate
              </Button>
            )}
          </Stack>
        </Skeleton>
      </Box>
      <Box boxShadow="lg" bg={"white"} mt={5} borderRadius={5} p={5}>
        <Text fontWeight="bold" fontSize={["xs", "sm", "md", "lg", "xl"]}>
          Your Stealth Address
        </Text>
        <Skeleton isLoaded={!isLoading}>
          <Stack direction={["column"]}>
            {listStealthAddress.map(
              (
                item: GetStealthAddressOutput & {
                  balance: string;
                }
              ) => (
                <Box
                  boxShadow="lg"
                  bg={"honeydew"}
                  key={item.address}
                  borderRadius={5}
                  mt={5}
                  p={5}
                  flex={1}
                  onClick={() =>
                    getPrivateKeyOfStealthAddress(item.address, item.from)
                  }
                  _hover={{
                    cursor: "pointer",
                  }}
                >
                  <Stack
                    justifyContent="space-between"
                    direction={["column", "column", "row"]}
                  >
                    <Stack>
                      <Text color="teal.500" fontWeight="bold">
                        {item.address}
                      </Text>
                      <Text mt={5} fontSize={["sm"]}>
                        From: {item.from}
                      </Text>
                    </Stack>
                    <Center>
                      <Text color="purple.500" fontWeight="bold">
                        {item.balance} MATIC
                      </Text>
                    </Center>
                  </Stack>
                </Box>
              )
            )}
          </Stack>
        </Skeleton>
      </Box>
      <Box boxShadow="lg" bg={"white"} borderRadius={5} mt={5} p={5}>
        <Text fontWeight="bold" fontSize={["xs", "sm", "md", "lg", "xl"]}>
          Transfer Matic
        </Text>
        <Skeleton mt={5} isLoaded={!isLoading}>
          <Stack direction={["column"]}>
            <Text>To Address</Text>
            <Input
              value={toAddress}
              onChange={onChangeToAddress}
              placeholder=""
            />
            {stealthAddress && (
              <Stack>
                <Text color="red.500" fontSize={["sm"]}>
                  Stealth Address: {stealthAddress}
                </Text>
              </Stack>
            )}

            <Text mt={5}>Amount</Text>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="MATIC"
            />
            <Button
              disabled={
                !stealthAddress ||
                !amount ||
                !toAddress ||
                !publicKey ||
                !privKey ||
                toAddress == stealthAddress ||
                toAddress == connectedAddress
              }
              onClick={transferMatic}
              mt={"10"}
              colorScheme="teal"
            >
              Transfer
            </Button>
          </Stack>
        </Skeleton>
      </Box>
    </BaseLayout>
  );
};

export default StealthAddress;
