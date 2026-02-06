pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import { UniversalRouter } from "@uniswap/universal-router/contracts/UniversalRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { IV4Router } from "@uniswap/v4-periphery/src/interfaces/IV4Router.sol";
import { Actions } from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import { IPermit2 } from "@uniswap/permit2/src/interfaces/IPermit2.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { StateLibrary } from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { Currency } from "@uniswap/v4-core/src/types/Currency.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";

contract GetQuoteExactInputSingleScript is Script {
  using StateLibrary for IPoolManager;

  UniversalRouter public immutable router = UniversalRouter(payable(0xf70536B3bcC1bD1a972dc186A2cf84cC6da6Be5D));
  IPoolManager public immutable poolManager = IPoolManager(0x00B036B58a818B1BC34d502D3fE730Db729e62AC);
  IPermit2 public immutable permit2 = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
  address usdy = 0x215d899341832F1bFD18D44734CbC57841dA24Ad;
  address xauy = 0xE687db5641A7C6269d5cD14d43bf4304096239bF;
  address runner = 0xECcEfbCE887DBdc1c393A409BaAb153F3380a364;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    uint128 amountIn = 1e17;
    uint128 minAmountOut = 0;
    PoolKey memory key = PoolKey({
      currency0: Currency.wrap(address(usdy)),
      currency1: Currency.wrap(address(xauy)),
      fee: 100,
      tickSpacing: 1,
      hooks: IHooks(address(0))
    });

    // approve first
    IERC20(usdy).approve(address(permit2), type(uint256).max);
    permit2.approve(usdy, address(router), type(uint160).max, uint48(block.timestamp + 1 hours));

    // we swap
    bytes memory commands = abi.encodePacked(uint8(Commands.SEAPORT_V1_5));
    bytes[] memory inputs = new bytes[](1);

    bytes memory actions = abi.encodePacked(
      uint8(Actions.SWAP_EXACT_IN_SINGLE),
      uint8(Actions.SETTLE_ALL),
      uint8(Actions.TAKE_ALL)
    );

    bytes[] memory params = new bytes[](3);
    params[0] = abi.encode(
      IV4Router.ExactInputSingleParams({
        poolKey: key,
	zeroForOne: true,
	amountIn: amountIn,
	amountOutMinimum: minAmountOut,
	hookData: bytes("")
      })
    );
    params[1] = abi.encode(key.currency0, amountIn);
    params[2] = abi.encode(key.currency1, minAmountOut);

    inputs[0] = abi.encode(actions, params);

    uint256 balanceCurrency0Before = key.currency0.balanceOf(runner);
    uint256 balanceCurrency1Before = key.currency1.balanceOf(runner);
    
    uint256 deadline = block.timestamp + 20;
    router.execute(commands, inputs, deadline);

    uint256 amountOut = key.currency1.balanceOf(runner);
    require(amountOut >= minAmountOut, "Insufficient output amount");

    uint256 balanceCurrency0After = key.currency0.balanceOf(runner);
    uint256 balanceCurrency1After = key.currency1.balanceOf(runner);


    console.log("==============");
    console.log("Currency0 Balance Before => After:");
    console.logUint(balanceCurrency0Before);  
    console.log("=>");
    console.logUint(balanceCurrency0After);  
    console.log("changes");
    console.logUint(balanceCurrency0Before - balanceCurrency0After);
    console.log("==============");

    console.log("==============");
    console.log("Currency1 Balance Before => After:");
    console.logUint(balanceCurrency1Before);  
    console.log("=>");
    console.logUint(balanceCurrency1After);  
    console.log("changes");
    console.log(balanceCurrency1After - balanceCurrency1Before);
    console.log("==============");

    // return amountOut;

    vm.stopBroadcast();
  }
}

