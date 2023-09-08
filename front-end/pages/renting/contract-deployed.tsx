import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const ContractDeployed = () => {
  const [data, setData] = useState<any>([]);

  return (
    <Stack>
      <Text fontWeight="bold" fontSize={["xs", "sm", "md", "lg", "xl"]}>
        Contract deployed
      </Text>
    </Stack>
  );
};

export default ContractDeployed;
