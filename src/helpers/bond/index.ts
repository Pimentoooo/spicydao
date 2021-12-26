import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import MimSPCIcon from "../../assets/tokens/spc-mim.png";
import DaiSPCIcon from "../../assets/tokens/spc-dai.png";
import AvaxTimeIcon from "../../assets/tokens/TIME-AVAX.svg";
import DAIIcon from "../../assets/tokens/DAI.e.svg"

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract, JoeLpReserveContract } from "../../abi";

export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0x24B330a84A3A8114fCb8A29C80c0b39B6bFF5bb2",
            reserveAddress: "0x130966628846bfd36ff31a822705796e8cb8c18d",
        },
    },
});

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    bondIconSvg: DAIIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0x793393a2a0E2dCeAba687c139F657BdC9259335D",
            reserveAddress: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
        },
    },
});

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "wAVAX",
    bondToken: "AVAX",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0xE02B1AA2c4BE73093BE79d763fdFFC0E3cf67318",
            reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
        },
    },
    // tokensInStrategy: "756916000000000000000000",
});

export const mimSPC = new LPBond({
    name: "mim_spc_lp",
    displayName: "SPC-MIM LP",
    bondToken: "MIM",
    bondIconSvg: MimSPCIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0xC59c97065873a433431A880e5a30888605323D87",
            reserveAddress: "0x910fA8fcd781AcCaa82CD544Ac235Ba921927494",
        },
    },
    lpUrl: "https://app.pangolin.exchange/#/add/0x130966628846BFd36ff31a822705796e8cb8C18D/0x6007FCA39B5398FeaC4D06D75435A564A086Bab8",
});

export const daiSPC = new LPBond({
    name: "dai_spc_lp",
    displayName: "SPC-DAI LP",
    bondToken: "DAI",
    bondIconSvg: DaiSPCIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: JoeLpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0x0a235951b775b89d3d531757787ce7b605f3afc0",
            reserveAddress: "0x2FB85dc23D5aC0130cEA07EF8736bB091b03117d",
        },
    },
    lpUrl: "https://traderjoexyz.com/#/pool/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/0x6007FCA39B5398FeaC4D06D75435A564A086Bab8",
});

export const avaxSPC = new CustomLPBond({
    name: "avax_verse_lp",
    displayName: "VERSE-AVAX LP",
    bondToken: "AVAX",
    bondIconSvg: AvaxTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0xc26850686ce755FFb8690EA156E5A6cf03DcBDE1",
            reserveAddress: "0xf64e1c5B6E17031f5504481Ac8145F4c3eab4917",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

// export default [mim, wavax, mimTime, avaxTime];
export default [mim, mimSPC, dai, daiSPC];
