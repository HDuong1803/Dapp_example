// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SCI is ERC20Votes {
    constructor() ERC20("SCIMTA", "SCI") ERC20Permit("SCIMTA") {
        _mint(msg.sender, 1000000000 ether);
    }
}
