import { useActiveChain, useSwitchChain } from "@thirdweb-dev/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { SideBarData } from "../constants/data/sidebar";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const BaseLayout = ({
  children,
  selectTabIndex = 0,
}: {
  children: React.ReactNode;
  selectTabIndex?: number;
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const currentNetwork = useActiveChain();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);
  }, [currentNetwork]);

  if (typeof window === "undefined" || !isBrowser) {
    return <></>;
  }

  return (
    <div className={styles.App}>
      <Head>
        <title>SCIMTA Protocol</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Dapp" />
      </Head>
      <Sidebar
        isLoading={isLoading}
        selectIndex={selectTabIndex}
        content={children}
        data={SideBarData}
      />
    </div>
  );
};

export default BaseLayout;
