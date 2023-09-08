import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import BaseLayout from "../layouts/base";

const Dao: NextPage = () => {
  return (
    <BaseLayout selectTabIndex={4}>
      <Box bg={"white"} borderRadius={5} p={5}>
        DAO
      </Box>
    </BaseLayout>
  );
};

export default Dao;
