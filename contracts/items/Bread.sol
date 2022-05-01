// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./BaseItem.sol";

contract Bread is BaseItem {
    constructor(
        address _doubloon,
        address _baker,
        uint256 _exchangeRate
    ) ERC20("Bread", "BRD") {
        doubloon = IERC20(_doubloon);
        merchant = _baker;
        exchangeRate = _exchangeRate;
    }
}
