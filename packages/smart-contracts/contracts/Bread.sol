// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bread is ERC20 {
    IERC20 public doubloon;
    address public baker;
    uint256 constant public EXCHANGE_RATE = 10; // 10 slices of bread for 1 doubloon

    constructor(address _doubloon, address _baker) ERC20("Bread", "BRD") {
        doubloon = IERC20(_doubloon);
        baker = _baker;
    }

    function bake() external {
        uint256 amount = doubloon.allowance(msg.sender, address(this));
        require(amount > 0, "Start the trade first");
        
        doubloon.transferFrom(msg.sender, baker, amount); // pay the baker
           
        _mint(msg.sender, amount * EXCHANGE_RATE); // bake the bread
    }
}
