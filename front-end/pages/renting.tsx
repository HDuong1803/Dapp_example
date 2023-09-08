import {
  Box,
  Stack,
  HStack,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { GiCardAceHearts } from "react-icons/gi";
import { AiTwotoneShop } from "react-icons/ai";
import type { NextPage } from "next";
import BaseLayout from "../layouts/base";
import Erc721Renting from "./renting/erc721-renting";
import RentMarket from "./renting/rent-market";
import ContractDeployed from "./renting/contract-deployed";
import ContractUsage from "./renting/contract-usage";
import SciRentMarket from "./renting/sci-rent-market";

const Renting: NextPage = () => {
  return (
    <BaseLayout selectTabIndex={4}>
      <Stack direction={"column"}>
        <Stack direction={"row"}>
          <Stack
            boxShadow="lg"
            bg={"white"}
            borderRadius={5}
            p={5}
            width={"50%"}
          >
            <Accordion allowToggle defaultIndex={0}>
              <AccordionItem border={"none"}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Box
                          as={GiCardAceHearts}
                          boxSize="26px"
                          color="purple.500"
                        />
                        <Text as={"b"} fontSize="x" color="gray.600">
                          {"ERC-4907"}
                        </Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Erc721Renting />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border={"none"}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Box
                          as={AiTwotoneShop}
                          boxSize="26px"
                          color="purple.500"
                        />
                        <Text as={"b"} fontSize="x" color="gray.600">
                          {"Rent Market"}
                        </Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <RentMarket />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
          <Stack
            bg={"white"}
            boxShadow="lg"
            borderRadius={5}
            p={5}
            mt={5}
            width={"50%"}
          >
            <ContractDeployed />
          </Stack>
        </Stack>
        <Stack direction={"row"}>
          <Stack
            flex={1}
            boxShadow="lg"
            bg={"white"}
            borderRadius={5}
            p={5}
            width={"50%"}
          >
            <SciRentMarket />
          </Stack>
          <Stack
            flex={1}
            boxShadow="lg"
            bg={"white"}
            borderRadius={5}
            p={5}
            width={"50%"}
          >
            <ContractUsage />
          </Stack>
        </Stack>
      </Stack>
    </BaseLayout>
  );
};

export default Renting;
