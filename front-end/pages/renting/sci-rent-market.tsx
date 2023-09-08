import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

const SciRentMarket = () => {
  const [data, setData] = useState<any>([]);

  return (
    <Stack>
      <Text fontWeight="bold" fontSize={["xs", "sm", "md", "lg", "xl"]}>
        SCIMTA Rent Market
      </Text>
    </Stack>
  );
};

export default SciRentMarket;
