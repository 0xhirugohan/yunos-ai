// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";

import {USDY} from "../src/USDY.sol";
import {XAUY} from "../src/XAUY.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TransferERC20Script is Script {
    USDY public usdy;
    XAUY public xauy;

    error FailToTransfer();

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

	usdy = USDY(0x215d899341832F1bFD18D44734CbC57841dA24Ad);
	xauy = XAUY(0xE687db5641A7C6269d5cD14d43bf4304096239bF);

	// transfer to dev address for test
	bool transferUsdySuccess = IERC20(usdy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100e18);
	bool transferXauySuccess = IERC20(xauy).transfer(0x0d76b138023D1B901a155f491CE245736729893a, 100e18);
	if (!transferUsdySuccess || !transferXauySuccess) revert FailToTransfer();
	  
        vm.stopBroadcast();
    }
}
