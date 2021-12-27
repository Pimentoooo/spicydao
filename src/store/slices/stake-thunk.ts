import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, VerseTokenContract, sVerseTokenContract, StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const verseContract = new ethers.Contract(addresses.SPC_ADDRESS, VerseTokenContract, signer);
    const sverseContract = new ethers.Contract(addresses.SPICY_ADDRESS, sVerseTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "verse") {
            approveTx = await verseContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        if (token === "sverse") {
            approveTx = await sverseContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = "Approve " + (token === "time" ? "Staking" : "Unstaking");
        const pendingTxnType = token === "time" ? "approve_staking" : "approve_unstaking";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const stakeAllowance = await verseContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await sverseContract.allowance(address, addresses.STAKING_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            staking: {
                verseStake: Number(stakeAllowance),
                sverseUnstake: Number(unstakeAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "stake") {
            stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address, { gasPrice });
        } else {
            stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
        }
        const pendingTxnType = action === "stake" ? "staking" : "unstaking";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await stakeTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});

interface IActionValueAsyncThunk {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeForfeit = createAsyncThunk(
    "stake/forfeit",
    async ({ provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
      if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
      }
  
      const signer = provider.getSigner();
      const addresses = getAddresses(networkID);
      const staking = new ethers.Contract(addresses.STAKING_ADDRESS as string, StakingContract, signer);
      let forfeitTx;
  
      try {
        forfeitTx = await staking.forfeit();
        const text = "Forfeiting";
        const pendingTxnType = "forfeiting";
        dispatch(fetchPendingTxns({ txnHash: forfeitTx.hash, text, type: pendingTxnType }));
        await forfeitTx.wait();
        // dispatch(
        //   fetchAccountSuccess({
        //     staking: {
        //       mamaStake: +stakeAllowance,
        //       mamaUnstake: +unstakeAllowance,
        //     },
        //   })
        //   // success(messages.tx_successfully_send)
        //   );
      } catch (e: any) {
        // return metamaskErrorWrap(e, dispatch);
        return false;
      } finally {
        if (forfeitTx) {
          dispatch(clearPendingTxn(forfeitTx.hash));
        }
      }
      // await sleep(7);
      // dispatch(info(messages.balance_update_soon));
      // await sleep(15);
      // await dispatch(loadAccountDetails({ address, networkID, provider }));
      // dispatch(info(messages.balance_updated));
      return;
    },
  );
  
  export const changeClaim = createAsyncThunk(
    "stake/changeClaim",
    async ({ provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
      if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
      }
  
      const signer = provider.getSigner();
      const addresses = getAddresses(networkID);
      const staking = new ethers.Contract(addresses.STAKING_ADDRESS as string, StakingContract, signer);
      let claimTx;
  
      try {
        claimTx = await staking.claim(address);
        const text = "Claiming";
        const pendingTxnType = "claiming";
        dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text, type: pendingTxnType }));
        await claimTx.wait();
        // dispatch(success(messages.tx_successfully_send));
      } catch (e: any) {
        // return metamaskErrorWrap(e, dispatch);
        return false;
      } finally {
        if (claimTx) {
          dispatch(clearPendingTxn(claimTx.hash));
        }
      }
      // await sleep(7);
      // dispatch(info(messages.balance_update_soon));
      // await sleep(7);
      // await dispatch(loadAccountDetails({ address, networkID, provider }));
      // dispatch(info(messages.balance_updated));
      return;
    },
  );
  
