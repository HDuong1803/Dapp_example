import {
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useSDK } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import { useEffect, useState } from "react";
import { AbiItem, isAddress } from "web3-utils";
import ContractFunctionComponent from "../../components/contract-function";
import ApiServices from "../../services/api";
const ContractUsage = () => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractInstance, setContractInstance] =
    useState<SmartContract<BaseContract> | null>(null);
  const sdk = useSDK();

  const [contractFunctions, setContractFunctions] = useState<{
    view: AbiItem[];
    write: AbiItem[];
  }>({
    view: [],
    write: [],
  });

  const getAbi = async (address: string) => {
    try {
      if (!sdk) return;
      const res = await ApiServices.tokenCreator.abi({
        address,
      });
      const functions = res.data.data.abi.filter(
        (item) => item.type == "function"
      );
      const contractFromAbi = await sdk.getContractFromAbi(
        address,
        res.data.data.abi as any
      );
      setContractInstance(contractFromAbi);
      const listTab: {
        view: AbiItem[];
        write: AbiItem[];
      } = {
        view: [],
        write: [],
      };

      for (const func of functions) {
        if (func.stateMutability == "view" || func.stateMutability == "pure") {
          listTab.view.push(func);
        } else {
          listTab.write.push(func);
        }
      }
      setContractFunctions(listTab);
    } catch (error) {}
  };

  useEffect(() => {
    if (isAddress(contractAddress)) {
      getAbi(contractAddress);
    } else {
      setContractFunctions({
        view: [],
        write: [],
      });
      setContractInstance(null);
    }
  }, [contractAddress]);

  return (
    <Stack>
      <Text fontWeight="bold" fontSize={["xs", "sm", "md", "lg", "xl"]}>
        Contract usage
      </Text>
      <Stack direction={["column", "column"]}>
        <Stack flex={1}>
          <Text>Contract address</Text>
          <Input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x...."
          />
        </Stack>
        <Tabs isFitted colorScheme="green" variant="soft-rounded">
          <TabList mb="1em">
            <Tab>View</Tab>
            <Tab>Write</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ContractFunctionComponent
                contractInstance={contractInstance}
                functions={contractFunctions.view}
              />
            </TabPanel>
            <TabPanel>
              <ContractFunctionComponent
                contractInstance={contractInstance}
                functions={contractFunctions.write}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Stack>
  );
};

export default ContractUsage;
