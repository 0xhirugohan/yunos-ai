import { SwapExactInSingle } from "@uniswap/v4-sdk";
import { Token, ChainId } from "@uniswap/sdk-core";
import { ethers, parseUnits, JsonRpcProvider, formatUnits } from "ethers";

import {QUOTER_ABI} from "./abi";

console.log("Getting Quote with Uniswap");

const ETH_TOKEN = new Token(
  ChainId.MAINNET,
  "0x0000000000000000000000000000000000000000",
  18,
  "ETH",
  "Ether"
);

const USDC_TOKEN = new Token(
  ChainId.MAINNET,
  "0xdf841d5d697f9e77eb4355842326d38be32e7873",
  18,
  "USDC",
  "USDC",
);

const QUOTER_CONTRACT_ADDRESS = "0x56dcd40a3f2d466f48e7f48bdbe5cc9b92ae4472";

const CurrentConfig: SwapExactInSingle = {
  poolKey: {
    currency0: ETH_TOKEN.address,
    currency1: USDC_TOKEN.address,
    fee: 3000,
    tickSpacing: 60,
    hooks: "0xf666f0f4b733b0771e4a04912689b2dbd1b44444",
  },
  zeroForOne: true,
  amountIn: parseUnits("1", ETH_TOKEN.decimals).toString(),
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
const formated = formatUnits("" + quotedAmountOut?.amountOut, USDC_TOKEN.decimals);
console.log({ formated });
