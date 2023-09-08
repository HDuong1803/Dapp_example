import { Link } from "@chakra-ui/react";
const LinkScan = ({
  transactionHash,
  address,
  raw,
}: {
  transactionHash?: string;
  address?: string;
  raw?: string;
}) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={
        transactionHash
          ? `https://mumbai.polygonscan.com/tx/${transactionHash}`
          : raw
          ? `${raw}`
          : `https://mumbai.polygonscan.com/address/${address}`
      }
    >
      {transactionHash ? `${transactionHash}` : raw ? `${raw}` : `${address}`}
    </Link>
  );
};

export default LinkScan;
