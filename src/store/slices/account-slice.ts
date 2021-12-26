import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { VerseTokenContract, sVerseTokenContract, MimTokenContract, wsVerseTokenContract, StakingContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        sverse: string;
        verse: string;
        wsverse: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const sverseContract = new ethers.Contract(addresses.SPICY_ADDRESS, sVerseTokenContract, provider);
    const sverseBalance = await sverseContract.balanceOf(address);
    console.log('sverseBalance', sverseBalance);
    const verseContract = new ethers.Contract(addresses.SPC_ADDRESS, VerseTokenContract, provider);
    const verseBalance = await verseContract.balanceOf(address);
    const wsverseContract = new ethers.Contract(addresses.WSPICY_ADDRESS, wsVerseTokenContract, provider);
    const wsverseBalance = await wsverseContract.balanceOf(address);

    return {
        balances: {
            sverse: ethers.utils.formatUnits(sverseBalance, "gwei"),
            verse: ethers.utils.formatUnits(verseBalance, "gwei"),
            wsverse: ethers.utils.formatEther(wsverseBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        verse: string;
        sverse: string;
        wsverse: string;
    };
    staking: {
        verse: number;
        sverse: number;
    };
    wrapping: {
        sverse: number;
    };
    warmup: {
        warmupAmount: string;
        expiryBlock: number;
    }
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let verseBalance = 0;
    let sverseBalance = 0;

    let wsverseBalance = 0;
    let sverseWsverseAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    let depositAmount = 0;
    let expiry = 0;

    const addresses = getAddresses(networkID);

    if (addresses.SPC_ADDRESS) {
        const verseContract = new ethers.Contract(addresses.SPC_ADDRESS, VerseTokenContract, provider);
        verseBalance = await verseContract.balanceOf(address);
        stakeAllowance = await verseContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.SPICY_ADDRESS) {
        const sverseContract = new ethers.Contract(addresses.SPICY_ADDRESS, sVerseTokenContract, provider);
        sverseBalance = await sverseContract.balanceOf(address);
        unstakeAllowance = await sverseContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WSPICY_ADDRESS) {
            sverseWsverseAllowance = await sverseContract.allowance(address, addresses.WSPICY_ADDRESS);
        }
    }

    if (addresses.WSPICY_ADDRESS) {
        const wsverseContract = new ethers.Contract(addresses.WSPICY_ADDRESS, wsVerseTokenContract, provider);
        wsverseBalance = await wsverseContract.balanceOf(address);
    }

    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS as string, StakingContract, provider,);
    depositAmount = (await stakingContract.warmupInfo(address)).deposit;
    expiry = (await stakingContract.warmupInfo(address)).expiry;

    return {
        balances: {
            sverse: ethers.utils.formatUnits(sverseBalance, "gwei"),
            verse: ethers.utils.formatUnits(verseBalance, "gwei"),
            wsverse: ethers.utils.formatEther(wsverseBalance),
        },
        staking: {
            verse: Number(stakeAllowance),
            sverse: Number(unstakeAllowance),
        },
        wrapping: {
            sverse: Number(sverseWsverseAllowance),
        },
        warmup: {
            warmupAmount: ethers.utils.formatUnits(depositAmount, "gwei"),
            expiryBlock: expiry,
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    let allowance,
        balance = "0";

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        sverse: string;
        verse: string;
        wsverse: string;
    };
    loading: boolean;
    staking: {
        verse: number;
        sverse: number;
    };
    wrapping: {
        sverse: number;
    };
    warmup: {
        warmupAmount: string;
        expiryBlock: number;
    }
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { sverse: "", verse: "", wsverse: "" },
    staking: { verse: 0, sverse: 0 },
    wrapping: { sverse: 0 },
    tokens: {},
    warmup: {
        warmupAmount: "", expiryBlock: 0
    }
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
