// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {XAUY} from "../src/XAUY.sol";

contract XAUYScript is Script {
    XAUY public xauy;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

	xauy = new XAUY();

        vm.stopBroadcast();
    }
}
