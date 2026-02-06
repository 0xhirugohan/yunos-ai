// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {USDY} from "../src/USDY.sol";

contract USDYScript is Script {
    USDY public usdy;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

	usdy = new USDY();

        vm.stopBroadcast();
    }
}
