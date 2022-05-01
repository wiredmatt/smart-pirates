// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Rum is ERC20 {
    IERC20 public doubloon;
    address public merchant;
    uint256 public constant EXCHANGE_RATE = 3; // 1 bottle of Rum for 3 DBL

    constructor(address _doubloon, address _owner) ERC20("Rum", "RUM") {
        doubloon = IERC20(_doubloon);
        merchant = _owner;
    }

    function buy() external {
        uint256 amount = doubloon.allowance(msg.sender, address(this));
        require(amount > 0, "Start the trade first");
        require(amount >= EXCHANGE_RATE, "Amount too low");

        doubloon.transferFrom(msg.sender, merchant, amount); // pay the owner

        _mint(msg.sender, amount / EXCHANGE_RATE); // send the bottles
    }
}
