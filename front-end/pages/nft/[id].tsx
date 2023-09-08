import type { NextPage } from "next";
import BaseLayout from "../../layouts/base";
import { useRouter } from "next/router";

const NFTDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <BaseLayout>{id}</BaseLayout>;
};

export default NFTDetail;
