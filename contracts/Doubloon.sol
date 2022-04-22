// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Gold.sol";
import "hardhat/console.sol";

contract Doubloon is ERC20 {
    uint256 public constant EXCHANGE_RATE = 100; // 1 GOLD ingot = 100 doubloon
    Gold public gold;

    constructor(address _gold) ERC20("Doubloon", "DBL") {
        gold = Gold(_gold);
    }

    function makeDoubloon(uint256 goldAmount) external {
        console.log("allowance:", gold.allowance(msg.sender, address(this)));
        require(goldAmount >= 0, "Provide at least 1 GOLD");

        gold.transferFrom(msg.sender, address(this), goldAmount);

        gold.meltGold(goldAmount);

        _mint(msg.sender, goldAmount * EXCHANGE_RATE);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
