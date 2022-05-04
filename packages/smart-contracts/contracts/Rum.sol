// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Rum is ERC20 {
    IERC20 public doubloon;
    address public merchant;
    uint256 public constant EXCHANGE_RATE = 5; // 5 DBL for 1 RUM

    constructor(address _doubloon, address _owner) ERC20("Rum", "RUM") {
        doubloon = IERC20(_doubloon);
        merchant = _owner;
    }

    function buy(uint256 amount) external {
        doubloon.transferFrom(msg.sender, merchant, amount); // pay the owner
        _mint(msg.sender, (amount / EXCHANGE_RATE) * 10**decimals()); // send the bottles
    }
}
