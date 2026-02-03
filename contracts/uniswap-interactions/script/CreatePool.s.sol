// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {USDY} from "../src/USDY.sol";
import {XAUY} from "../src/XAUY.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";

import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// v4-core/=lib/v4-core/src/

contract CreatePoolScript is Script {
    USDY public usdy;
    XAUY public xauy;
    // unichain PoolManager
    address public manager = 0x00B036B58a818B1BC34d502D3fE730Db729e62AC;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

	usdy = new USDY();
	xauy = new XAUY();

	// transfer to dev address for test
	IERC20(usdy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100);
	IERC20(xauy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100);

	address currency0 = address(usdy);
	address currency1 = address(xauy);

	if (uint160(currency0) > uint160(currency1)) {
	  currency0 = address(xauy);
	  currency1 = address(usdy);
	}

	PoolKey memory pool = PoolKey({
	  currency0: Currency.wrap(address(usdy)),
	  currency1: Currency.wrap(address(xauy)),
	  fee: 100,
	  tickSpacing: 1,
	  hooks: IHooks(address(0))
	});

	console.logString("PoolKey generated");
	PoolId poolId = pool.toId();
	console.logBytes32(PoolId.unwrap(poolId));

	// hardcode 1:1
	uint160 startingPrice = 79228162514264337593543950336;
	IPoolManager(manager).initialize(pool, startingPrice);

        vm.stopBroadcast();
    }
}
