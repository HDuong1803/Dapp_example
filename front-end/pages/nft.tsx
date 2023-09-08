import type { NextPage } from "next";
import BaseLayout from "../layouts/base";
import {
  Box,
  Button,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSDK } from "@thirdweb-dev/react";
import { ABI_NFT } from "../constants/abi";
import { useState } from "react";

const NFT: NextPage = () => {
  const sdk = useSDK();
  const toast = useToast();
  const [id, setId] = useState("");
  const [idGet, setIdGet] = useState("");
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const mintNFT = async () => {
    if (!sdk) return;
    try {
      const nftContract = await sdk.getContract(
        "0x9eDC647b5d5a8D7C9FeD27a6073842b645bc3675",
        ABI_NFT
      );

      const tx = await nftContract.call("mint", [id, name, des, image]);
      toast({
        title: "Success",
        description: `Transaction hash: ${tx.receipt.transactionHash}`,
        status: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const getNFT = async () => {
    if (!sdk) return;
    try {
      const nftContract = await sdk.getContract(
        "0x9eDC647b5d5a8D7C9FeD27a6073842b645bc3675",
        ABI_NFT
      );
      const view = await nftContract.call("tokenData", [idGet]);
      setData(view);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <BaseLayout>
      <Stack gap={2}>
        <Text>Mint NFT</Text>
        <Input
          value={id}
          type="number"
          onChange={(e) => setId(e.target.value)}
          placeholder="token id"
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
        <Input
          value={des}
          onChange={(e) => setDes(e.target.value)}
          placeholder="description"
        />
        <Input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="image"
        />
        <Button onClick={mintNFT}>Mint</Button>
      </Stack>
      <Box h={1} w={"full"} bg={"#000"} my={"1rem"} />
      <Stack gap={2}>
        <Text>Get NFT</Text>
        <Input
          value={idGet}
          type="number"
          onChange={(e) => setIdGet(e.target.value)}
          placeholder="token id"
        />
        <Text>name: {data.name}</Text>
        <Text>description: {data.description}</Text>
        <Image maxW={"200px"} src={data.image} />
        <Button onClick={getNFT}>Get</Button>
      </Stack>
    </BaseLayout>
  );
};

export default NFT;
