import {
  Box,
  BoxProps,
  Button,
  Center,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChainId,
  ConnectWallet,
  useActiveChain,
  useAddress,
  useCoinbaseWallet,
  useConnectedWallet,
  useConnectionStatus,
  useDisconnect,
  useMetamask,
  useSDK,
  useSwitchChain,
  useWalletConnect,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo } from "react";
import { IconType } from "react-icons";
import { FiMenu, FiSettings } from "react-icons/fi";
import { SideBarData, SideBarDataProps } from "../constants/data/sidebar";
import { useStoreActions, useStoreState } from "../services/redux/hook";
import ApiServices from "../services/api";
export const ModalCheckConnect = () => {
  const setIsCheckConnectAction = useStoreActions(
    (state) => state.user.setIsCheckConnect
  );
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setIsCheckConnectAction({
        isCheckConnect: false,
        args: undefined,
        callback: undefined,
      });
    },
  });
  const connectionStatus = useConnectionStatus();

  const isCheckConnectDataState = useStoreState(
    (state) => state.user.isCheckConnectData
  );
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectCoinbase = useCoinbaseWallet();

  useEffect(() => {
    if (
      connectionStatus != "connected" &&
      isCheckConnectDataState.isCheckConnect
    ) {
      onOpen();
    } else {
      onClose();
      if (isCheckConnectDataState.args && isCheckConnectDataState.callback) {
        isCheckConnectDataState.callback(...isCheckConnectDataState.args);
      }
    }
  }, [connectionStatus, isCheckConnectDataState.isCheckConnect]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnOverlayClick
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader>Wallet connect</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Connect your wallet to using this app</Text>
          <Stack mt={4}>
            <Button
              onClick={() => connectWithMetamask()}
              _hover={{ bg: "#3443DD" }}
              color="white"
              bg="#3443A0"
            >
              Metamask
            </Button>
            <Button
              onClick={() => connectWithWalletConnect()}
              _hover={{ bg: "#3443DD" }}
              color="white"
              bg="#3443A0"
            >
              WalletConnect
            </Button>
            <Button
              onClick={() => connectCoinbase()}
              _hover={{ bg: "#3443DD" }}
              color="white"
              bg="#3443A0"
            >
              Coinbase
            </Button>
          </Stack>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export const ModalSwitchNetwork = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disconnect = useDisconnect();
  const network = useActiveChain();
  const setNetwork = useSwitchChain();

  const switchNetwork = async () => {
    if (network?.chainId == ChainId.Mumbai && isOpen) {
      onClose();
    } else if (setNetwork) {
      await setNetwork(ChainId.Mumbai);
    }
  };

  useEffect(() => {
    if (network && network?.chainId) {
      const currentChainId = network.chainId;
      if (currentChainId !== ChainId.Mumbai && !isOpen) {
        onOpen();
      } else if (currentChainId == ChainId.Mumbai && isOpen) {
        onClose();
      }
    }
  }, [network?.chainId]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnOverlayClick
      onClose={() => {
        disconnect();
        onClose();
      }}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader>Wrong network</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Current network not support</Text>
          <Center mt={4}>
            <Button
              onClick={switchNetwork}
              _hover={{ bg: "#3443DD" }}
              color="white"
              bg="#3443A0"
            >
              Switch to Mumbai network
            </Button>
          </Center>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export const ModalSignMessage = () => {
  const disconnect = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setUserDataAction = useStoreActions((state) => state.user.setData);
  const sdk = useSDK();
  const address = useAddress();
  const network = useActiveChain();

  const signMessage = async () => {
    if (sdk && address) {
      const signature = await sdk.wallet.sign("Music protocol");
      localStorage.setItem("address", address.toLowerCase());
      localStorage.setItem("signature", signature);
      await getUserData();
      onClose();
    }
  };

  const getUserData = async () => {
    if (address) {
      try {
        const resUser = await ApiServices.user.getUser(address);
        setUserDataAction(resUser.data.data);
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (network?.chainId && sdk) {
      const currentChainId = network.chainId;
      if (currentChainId == ChainId.Mumbai && address) {
        if (
          localStorage.getItem("address") != address.toLowerCase() ||
          !localStorage.getItem("signature")
        ) {
          setUserDataAction(undefined);
          onOpen();
        } else {
          getUserData();
        }
      } else if (isOpen) {
        onClose();
      }
    }
  }, [sdk, network?.chainId, address]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnOverlayClick
      onClose={() => {
        disconnect();
        onClose();
      }}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader>Sign message for verify your wallet</ModalHeader>
        <ModalBody>
          <Center>
            <Button
              onClick={signMessage}
              _hover={{ bg: "#3443DD" }}
              color="white"
              bg="#3443A0"
            >
              Sign message
            </Button>
          </Center>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default function Sidebar({
  data,
  content,
  selectIndex,
  isLoading,
}: {
  data: Array<SideBarDataProps>;
  content: React.ReactNode;
  selectIndex: number;
  isLoading: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    if (connectedWallet) {
      // addNetwork();
    }
  }, [connectedWallet]);

  return (
    <Box minH="100vh" bg={"#F9FAFB"} pb={20}>
      <ModalCheckConnect />
      <ModalSwitchNetwork />
      <ModalSignMessage />
      <SidebarContent
        data={data}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent data={data} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <AppNav title={data[selectIndex].name} onOpen={onOpen} />
      <Box
        ml={{ base: 0, md: 60 }}
        style={{
          padding: "1rem",
          transition: "all 0.3s ease",
          paddingTop: "calc(1rem + 85px)",
        }}
      >
        {isLoading ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            w={"100%"}
            h={"70vh"}
          >
            <Spinner
              thickness="7px"
              speed="1s"
              emptyColor="gray.200"
              color="yellow.400"
              size="xl"
            />
          </Stack>
        ) : (
          content
        )}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  data: Array<SideBarDataProps>;
}

const SidebarContent = ({ onClose, data, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      boxShadow={"2xl"}
      bg={"#F9FAFB"}
      {...rest}
    >
      <Flex
        h="84px"
        borderBottomWidth={"2px"}
        borderBottomColor="yellow.400"
        alignItems="center"
        px="4"
        bg={"white"}
        justifyContent="space-between"
      >
        <Text fontFamily={"mono"} fontWeight="bold" fontSize="2xl">
          SCIMTA
        </Text>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          color={"white"}
          bg={"green.400"}
          onClick={onClose}
        />
      </Flex>
      {data.map((link) => (
        <NavItem
          boxShadow={"lg"}
          bg={"white"}
          my={"5"}
          key={link.name}
          link={link.link}
          maintain={link.disabled}
          icon={link.icon}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  link: string;
  maintain?: boolean;
}

const NavItem = ({ icon, children, link, maintain, ...rest }: NavItemProps) => {
  const { pathname, replace } = useRouter();
  const isSelect = useMemo(() => {
    if (pathname == "/" && link == SideBarData[0].link) {
      return true;
    }
    return pathname.replace("/", "") === link.replace("/", "");
  }, [pathname, link]);
  return (
    <Box
      onClick={() => {
        if (isSelect || maintain) {
          return;
        } else {
          replace(link, undefined, { shallow: true });
        }
      }}
      cursor={maintain ? "not-allowed" : "pointer"}
      style={{ textDecoration: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={maintain ? "gray" : isSelect ? "green" : "black"}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        <Text fontFamily={"mono"} fontWeight={"bold"}>
          {children}
        </Text>
        {maintain && (
          <FiSettings
            style={{
              marginLeft: "auto",
              transition: "all 0.3s ease",
            }}
            className="rotate"
            fontSize="16"
          />
        )}
      </Flex>
    </Box>
  );
};

interface AppNavProps extends FlexProps {
  onOpen: () => void;
  title: string;
}

const AppNav = ({ onOpen, title, ...rest }: AppNavProps) => {
  return (
    <Stack
      position={"fixed"}
      right={0}
      left={0}
      ml={{ base: 0, md: 60 }}
      p={{ base: 1, md: 3 }}
      py={{ base: 2, md: 3 }}
      bg={"white"}
      direction={"row"}
      borderBottomWidth={2.5}
      borderColor={"yellow.400"}
      zIndex={10}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        color={"green"}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Box></Box>
      <Stack height={"58px"} justifyContent={"center"}>
        <ConnectWallet />
      </Stack>
    </Stack>
  );
};
