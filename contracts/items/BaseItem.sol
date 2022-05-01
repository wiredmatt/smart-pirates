// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract BaseItem is ERC20 {
    IERC20 public doubloon;
    address public merchant;
    uint256 public exchangeRate; // x doubloon for 1 item

    function buy() external {
        // direct buy
        uint256 amount = doubloon.allowance(msg.sender, address(this));
        require(amount > 0, "Start the trade first");

        doubloon.transferFrom(msg.sender, merchant, amount); // pay the merchant

        _mint(msg.sender, amount / exchangeRate); // send the items
    }

    modifier onlyMerchant() {
        require(msg.sender == merchant, "Only merchant can set prices");
        _;
    }

    function listForSale(uint256 _amount, address _market)
        external
        onlyMerchant
    {
        _mint(_market, _amount); // send the items to the market
    }

    function updateExchangeRate(uint256 _rate) external onlyMerchant {
        exchangeRate = _rate;
    }

    function getExchangeRate() external view returns (uint256) {
        return exchangeRate;
    }

    function getMerchant() external view returns (address) {
        return merchant;
    }
}
