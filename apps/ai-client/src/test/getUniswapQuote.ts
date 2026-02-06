import { SwapExactInSingle } from "@uniswap/v4-sdk";
import { Token, ChainId } from "@uniswap/sdk-core";
import { ethers, parseUnits, JsonRpcProvider, formatUnits } from "ethers";

import {QUOTER_ABI} from "./abi";

console.log("Getting Quote with Uniswap");

const XAUY_TOKEN = new Token(
  ChainId.UNICHAIN_SEPOLIA,
  "0xE687db5641A7C6269d5cD14d43bf4304096239bF",
  18,
  "XAUY",
  "XAUY"
);

const USDY_TOKEN = new Token(
  ChainId.UNICHAIN_SEPOLIA,
  "0x215d899341832F1bFD18D44734CbC57841dA24Ad",
  18,
  "USDC",
  "USDC",
);

const QUOTER_CONTRACT_ADDRESS = "0x56dcd40a3f2d466f48e7f48bdbe5cc9b92ae4472";

const CurrentConfig: SwapExactInSingle = {
  poolKey: {
    currency0: USDY_TOKEN.address,
    currency1: XAUY_TOKEN.address,
    fee: 100,
    tickSpacing: 1,
    hooks: "0x0000000000000000000000000000000000000000",
  },
  zeroForOne: true,
  amountIn: parseUnits("0.01", XAUY_TOKEN.decimals).toString(),
  amountOutMinimum: "0",
  hookData: "0x00",
};

const quoterContract: ethers.Contract = new ethers.Contract(
  QUOTER_CONTRACT_ADDRESS,
  QUOTER_ABI,
  new JsonRpcProvider("https://unichain-sepolia-rpc.publicnode.com"),
);

const quotedAmountOut = await quoterContract?.callStatic?.quoteExactInputSingle({
  poolKey: CurrentConfig.poolKey,
  zeroForOne: CurrentConfig.zeroForOne,
  exactAmount: CurrentConfig.amountIn,
  hookData: CurrentConfig.hookData,
});

console.log({ quotedAmountOut });
const formated = formatUnits("" + quotedAmountOut?.amountOut, USDY_TOKEN.decimals);
console.log({ formated });
