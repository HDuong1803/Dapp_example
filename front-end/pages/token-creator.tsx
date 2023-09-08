import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import BaseLayout from "../layouts/base";
import ContractDeployed from "./token-creator/contract-deployed";
import ContractUsage from "./token-creator/contract-usage";
import Erc1155 from "./token-creator/erc1155";
import Erc20 from "./token-creator/erc20";
import Erc721 from "./token-creator/erc721";

const TokenCreator: NextPage = () => {
  return (
    <BaseLayout>
      <Stack
        direction={["column", "column", "column", "column", "column", "row"]}
      >
        <Stack flex={1}>
          <Stack boxShadow="lg" bg={"white"} borderRadius={5} p={5}>
            <Tabs isFitted colorScheme="green" variant="soft-rounded">
              <TabList mb="1em">
                <Tab>ERC20</Tab>
                <Tab>ERC721</Tab>
                <Tab>ERC1155</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Erc20 />
                </TabPanel>
                <TabPanel>
                  <Erc721 />
                </TabPanel>
                <TabPanel>
                  <Erc1155 />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
          <Stack bg={"white"} boxShadow="lg" borderRadius={5} p={5} mt={5}>
            <ContractDeployed />
          </Stack>
        </Stack>
        <Stack flex={1} boxShadow="lg" bg={"white"} borderRadius={5} p={5}>
          <ContractUsage />
        </Stack>
      </Stack>
    </BaseLayout>
  );
};

export default TokenCreator;
