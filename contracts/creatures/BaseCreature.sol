// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract BaseCreature is ERC721Enumerable {
    IERC20 public doubloon;
    address public merchant;
    uint256 public exchangeRate; // x doubloons for 1 Creature
    uint256 public maxSupply;
    uint256 public tokenId;

    function mint() external {
        uint256 allowance = doubloon.allowance(msg.sender, address(this));

        require(allowance >= exchangeRate, "Approve to spend tokens first");

        doubloon.transferFrom(msg.sender, merchant, exchangeRate); // pay the baker

        tokenId += 1;

        _mint(msg.sender, tokenId);
    }

    modifier onlyMerchant() {
        require(msg.sender == merchant, "Only merchant can set prices");
        _;
    }

    function listForSale(uint256 _amount, address _market)
        external
        onlyMerchant
    {
        require(totalSupply() < maxSupply, "Already reached cap");
        require(totalSupply() + _amount < maxSupply, "Amount exceeds cap");

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
