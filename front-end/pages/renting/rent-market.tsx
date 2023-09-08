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

const RentMarket = () => {
  const [accessControlState, setAccessControlState] = useBoolean(false);
  const [fee, setFee] = useState("");
  const [admin, setAdmin] = useState("");
  const [token, setToken] = useState("");
  const [features, setFeatures] = useState<(string | number)[]>([]);

  const sdk = useSDK();
  const toast = useToast();

  const featuresMap = useMemo(
    () => ({
      UpdatableFeePercentage: "Updatable fee percentage",
      UpdatableAdminWallet: "Updatable admin wallet",
    }),
    []
  );
  useEffect(() => {
    if (
      features.includes(featuresMap.UpdatableFeePercentage) ||
      features.includes(featuresMap.UpdatableAdminWallet)
    ) {
      setAccessControlState.on();
    }
  }, [features]);

  const { onOpen, setTxResult } = useModalTransaction();
  const deployToken = async () => {
    try {
      if (onOpen) onOpen();
      const res = await ApiServices.renting.rentMarket({
        fee_percentage: fee,
        admin_wallet: admin,
        token_address: token,
        is_updatable_fee: features.includes(featuresMap.UpdatableFeePercentage),
        is_updatable_admin: features.includes(featuresMap.UpdatableAdminWallet),
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
          receipt: {},
          txState: "error",
        });
      } finally {
      }
    } catch (error) {
      console.error(`[rent-market][deployToken]`, error);
    }
  };
  const onChangeCheckBoxAccessControl = () => {
    if (
      features.includes(featuresMap.UpdatableFeePercentage) ||
      features.includes(featuresMap.UpdatableAdminWallet)
    ) {
      return toast({
        title: `You can't disable Access Control when once of Updatable is enabled`,
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
          <Text>Fee Percentage (%)</Text>
          <Input
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="20"
          />
        </Stack>
        <Stack flex={1}>
          <Text>Admin Wallet</Text>
          <Input
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
            placeholder="0xCeA2a20F681169BEe6Cfb04F446b61c5B45cf8E4"
          />
        </Stack>
        <Stack flex={1}>
          <Text>ERC-4907 address</Text>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="0x4Db77F59A3987fc6A111Cd944D16Ed501410896A"
            defaultValue={18}
          />
        </Stack>
      </Stack>
      <p />
      <Text as={"b"}>Features</Text>
      <CheckboxGroup
        value={features}
        onChange={setFeatures}
        colorScheme="purple"
      >
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox value={featuresMap.UpdatableFeePercentage}>
            Updatable Fee Percentage
          </Checkbox>
          <Checkbox value={featuresMap.UpdatableAdminWallet}>
            Updatable Admin Wallet
          </Checkbox>
        </Stack>
      </CheckboxGroup>
      <Stack direction={["column", "row"]}>
        <Text as={"b"}>Access Control</Text>
        <Checkbox
          colorScheme={"purple"}
          onChange={onChangeCheckBoxAccessControl}
          isChecked={accessControlState}
        />
      </Stack>
      <Stack direction={["column", "row"]}>
        <RadioGroup
          isDisabled={!accessControlState}
          colorScheme={"purple"}
          defaultValue="Ownable"
        >
          <Stack spacing={5} direction={["column", "row"]}>
            <Radio value="Ownable">Ownable</Radio>
            {/* <Radio value="Roles">Roles</Radio> */}
          </Stack>
        </RadioGroup>
      </Stack>
      <Button
        leftIcon={<IoIosSettings />}
        onClick={deployToken}
        colorScheme={"purple"}
        variant="solid"
      >
        Deploy Contract
      </Button>
    </Stack>
  );
};

export default RentMarket;
