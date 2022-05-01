// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./BaseItem.sol";

contract Rum is BaseItem {
    constructor(
        address _doubloon,
        address _barOwner,
        uint256 _exchangeRate
    ) ERC20("Rum", "RUM") {
        doubloon = IERC20(_doubloon);
        merchant = _barOwner;
        exchangeRate = _exchangeRate;
    }
}
