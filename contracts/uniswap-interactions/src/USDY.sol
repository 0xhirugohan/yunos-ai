pragma solidity ^0.8.24; //Do not change the solidity version as it negatively impacts submission grading
// SPDX-License-Identifier: MIT

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// learn more: https://docs.openzeppelin.com/contracts/5.x/erc20

contract USDY is ERC20 {
    constructor() ERC20("USDY", "USDY") {
      _mint(msg.sender, 1000 * (10 ** 18));
    }
}

