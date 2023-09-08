import { IconType } from "react-icons";
import { BsCoin, BsEmojiSunglasses, BsPeople } from "react-icons/bs";
import { GiClockwork, GiPayMoney } from "react-icons/gi";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";

export interface SideBarDataProps {
  name: string;
  icon: IconType;
  link: string;
  disabled?: boolean;
}

export const SideBarData: Array<SideBarDataProps> = [
  { name: "NFT", icon: BsCoin, link: "/nft" },
  // { name: "Token creator", icon: BsCoin, link: "/token-creator" },
  // {
  //   name: "Stealth Address",
  //   icon: BsEmojiSunglasses,
  //   link: "/stealth-address",
  // },
  // {
  //   name: "AMM",
  //   icon: MdOutlineSwapHorizontalCircle,
  //   link: "/amm",
  //   disabled: true,
  // },
  // { name: "Staking", icon: GiPayMoney, link: "/staking", disabled: true },
  // { name: "Renting", icon: GiClockwork, link: "/renting", disabled: true },
  // { name: "DAO", icon: BsPeople, link: "/dao", disabled: true },
];
