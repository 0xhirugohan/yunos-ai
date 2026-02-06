// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {USDY} from "../src/USDY.sol";
import {XAUY} from "../src/XAUY.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";

import {IHooks} from "v4-core/interfaces/IHooks.sol";
// import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPoolInitializer_v4} from "v4-periphery/src/interfaces/IPoolInitializer_v4.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {IAllowanceTransfer} from "v4-periphery/lib/permit2/src/interfaces/IAllowanceTransfer.sol";

contract CreatePoolScript is Script {
    bytes[] public params = new bytes[](2);
    USDY public usdy;
    XAUY public xauy;
    // unichain PoolManager
    address public poolManager = 0x00B036B58a818B1BC34d502D3fE730Db729e62AC;
    address payable public positionManager = payable(0xf969Aee60879C54bAAed9F3eD26147Db216Fd664);
    address public permit2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    error FailToTransfer();

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

	usdy = new USDY();
	xauy = new XAUY();

	// transfer to dev address for test
	bool transferUsdySuccess = IERC20(usdy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100);
	bool transferXauySuccess = IERC20(xauy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100);
	if (!transferUsdySuccess || !transferXauySuccess) revert FailToTransfer();

	address currency0 = address(usdy);
	address currency1 = address(xauy);

	if (uint160(currency0) > uint160(currency1)) {
	  currency0 = address(xauy);
	  currency1 = address(usdy);
	}

	PoolKey memory pool = PoolKey({
	  currency0: Currency.wrap(address(currency0)),
	  currency1: Currency.wrap(address(currency1)),
	  fee: 100,
	  tickSpacing: 1,
	  hooks: IHooks(address(0))
	});

	console.logString("PoolKey generated");
	PoolId poolId = pool.toId();
	console.logBytes32(PoolId.unwrap(poolId));

	// hardcode 1:1
	uint160 startingPrice = 79228162514264337593543950336;
	// initialize the pool with starting price
	// IPoolManager(poolManager).initialize(pool, startingPrice);

        params[0] = abi.encodeWithSelector(
	  IPoolInitializer_v4.initializePool.selector,
	  pool,
	  startingPrice
	);

	bytes memory actions = abi.encodePacked(
	  uint8(Actions.MINT_POSITION),
	  uint8(Actions.SETTLE_PAIR)
	);
	bytes[] memory mintParams = new bytes[](2);
	mintParams[0] = abi.encode(
	  pool,
          -887272,
	  887272,
	  1e18, // this is the amount of token to be deposited to LP
	  type(uint256).max,
	  type(uint256).max,
	  msg.sender,
	  bytes("")
	);
	mintParams[1] = abi.encode(
	  pool.currency0,
	  pool.currency1
	);

	uint256 deadline = block.timestamp + 3600;
	params[1] = abi.encodeWithSelector(
	  IPositionManager(positionManager).modifyLiquidities.selector,
	  abi.encode(actions, mintParams),
	  deadline
	);

        IERC20(address(usdy)).approve(address(permit2), type(uint256).max);
	IAllowanceTransfer(address(permit2)).approve(
	  address(usdy),
	  address(positionManager),
	  type(uint160).max,
	  type(uint48).max
	);
	
	IERC20(address(xauy)).approve(address(permit2), type(uint256).max);
	IAllowanceTransfer(address(permit2)).approve(
	  address(xauy),
	  address(positionManager),
	  type(uint160).max,
	  type(uint48).max
	);

	PositionManager(positionManager).multicall(params);

	console.log("=============");
	console.log("PoolId");
	console.logBytes32(PoolId.unwrap(poolId));
	console.log("=============");
	console.log("XAUY Address:");
	console.logAddress(address(xauy));
	console.log("=============");
	console.log("USDY Address:");
	console.logAddress(address(usdy));
	console.log("=============");
	  
        vm.stopBroadcast();
    }
}
