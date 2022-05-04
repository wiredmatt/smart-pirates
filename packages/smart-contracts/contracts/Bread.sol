// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bread is ERC20 {
    IERC20 public doubloon;
    address public merchant;
    uint256 public constant EXCHANGE_RATE = 2; // 2 DBL for 1 BRD. Unit Price in DBL for BRD

    constructor(address _doubloon, address _baker) ERC20("Bread", "BRD") {
        doubloon = IERC20(_doubloon);
        merchant = _baker;
    }

    /**
     * @param amount the amount of doubloons to use in this trade
     */
    function buy(uint256 amount) external {
        doubloon.transferFrom(msg.sender, merchant, amount); // pay the baker
        _mint(msg.sender, (amount / EXCHANGE_RATE) * 10 ** decimals()); // bake the bread
    }
}
