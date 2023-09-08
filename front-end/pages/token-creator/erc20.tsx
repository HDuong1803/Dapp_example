import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useSDK } from "@thirdweb-dev/react";
import { useEffect, useMemo, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import LinkScan from "../../components/link-scan";
import { useModalTransaction } from "../../components/modal-transaction";
import ApiServices from "../../services/api";
import { deployContract } from "../../services/thirdweb";
import { useStoreActions } from "../../services/redux/hook";

const Erc20 = () => {
  const [accessControlState, setAccessControlState] = useBoolean(false);
  const [name, setName] = useState("MyToken");
  const [symbol, setSymbol] = useState("mtk");
  const [preMint, setPreMint] = useState(0);
  const [features, setFeatures] = useState<(string | number)[]>([]);
  const setIsCheckConnectAction = useStoreActions(
    (state) => state.user.setIsCheckConnect
  );
  const sdk = useSDK();
  const toast = useToast();

  const featuresMap = useMemo(
    () => ({
      Mintable: "Mintable",
      Burnable: "Burnable",
      Pausable: "Pausable",
    }),
    []
  );
  useEffect(() => {
    if (
      features.includes(featuresMap.Mintable) ||
      features.includes(featuresMap.Pausable)
    ) {
      setAccessControlState.on();
    }
  }, [features]);

  const { onOpen, setTxResult } = useModalTransaction();
  const deployToken = async () => {
    try {
      if (onOpen) onOpen();
      const res = await ApiServices.tokenCreator.erc20({
        name,
        symbol,
        initial_supply: preMint,
        is_burnable: features.includes(featuresMap.Burnable),
        is_mintable: features.includes(featuresMap.Mintable),
        is_pausable: features.includes(featuresMap.Pausable),
      });
      const { bytecode, name: contractName, uuid, abi } = res.data.data;
      try {
        if (!sdk) return;
        const contractDeployed = await deployContract(sdk, abi, bytecode, []);
        setTxResult({
          reason: "",
          content: [
            {
              title: "Transaction Hash",
              value: (
                <LinkScan transactionHash={contractDeployed.transactionHash} />
              ),
            },
            {
              title: "Contract Address",
              value: <Spinner color="green.500" />,
            },
          ],
          txState: "success",
        });
        const { contractAddress } = await contractDeployed.deployed();
        setTxResult({
          reason: "",
          content: [
            {
              title: "Transaction Hash",
              value: (
                <LinkScan transactionHash={contractDeployed.transactionHash} />
              ),
            },
            {
              title: "Contract Address",
              value: <LinkScan transactionHash={contractAddress} />,
            },
          ],
          txState: "success",
        });
        if (contractAddress)
          await ApiServices.tokenCreator.verify({
            uuid,
            address: contractAddress,
            name: contractName,
          });
      } catch (error: any) {
        setTxResult({
          reason: error.message,
          content: [],
          txState: "error",
        });
      }
    } catch (error) {
      console.error(`[erc20][deployToken]`, error);
    }
  };

  const deployTokenWithCheck = () => {
    setIsCheckConnectAction({
      isCheckConnect: true,
      args: [],
      callback: deployToken,
    });
  };

  const onChangeCheckBoxAccessControl = () => {
    if (
      features.includes(featuresMap.Mintable) ||
      features.includes(featuresMap.Pausable)
    ) {
      return toast({
        title: `You can't disable Access Control when Mintable or Pausable is enabled`,
        status: "error",
        isClosable: true,
        variant: "subtle",
        position: "top-right",
        duration: 1500,
      });
    }
    setAccessControlState.toggle();
  };

  return (
    <Stack>
      <Text as={"b"}>Settings</Text>
      <Stack direction={["column", "row"]}>
        <Stack flex={1}>
          <Text>Token Name</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />
        </Stack>
        <Stack flex={1}>
          <Text>Token Symbol</Text>
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder=""
          />
        </Stack>
        <Stack flex={1}>
          <Text>Pre-mint</Text>
          <Input
            value={preMint}
            onChange={(e) => setPreMint(parseInt(e.target.value))}
            type={"number"}
            placeholder=""
            defaultValue={18}
          />
        </Stack>
      </Stack>
      <p />
      <Text as={"b"}>Features</Text>
      <CheckboxGroup
        value={features}
        onChange={setFeatures}
        colorScheme="green"
      >
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox value={featuresMap.Mintable}>Mintable</Checkbox>
          <Checkbox value={featuresMap.Burnable}>Burnable</Checkbox>
          <Checkbox value={featuresMap.Pausable}>Pausable</Checkbox>
        </Stack>
      </CheckboxGroup>
      <Stack direction={["column", "row"]}>
        <Text as={"b"}>Access Control</Text>
        <Checkbox
          onChange={onChangeCheckBoxAccessControl}
          isChecked={accessControlState}
        />
      </Stack>
      <Stack direction={["column", "row"]}>
        <RadioGroup
          isDisabled={!accessControlState}
          colorScheme={"green"}
          defaultValue="Ownable"
        >
          <Stack spacing={5} direction="row">
            <Radio value="Ownable">Ownable</Radio>
            {/* <Radio value="Roles">Roles</Radio> */}
          </Stack>
        </RadioGroup>
      </Stack>
      <Button
        leftIcon={<IoIosSettings />}
        onClick={deployTokenWithCheck}
        colorScheme="teal"
        variant="solid"
        boxShadow={"lg"}
      >
        Deploy Token
      </Button>
    </Stack>
  );
};

export default Erc20;
