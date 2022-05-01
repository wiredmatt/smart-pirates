// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./BaseCreature.sol";

contract Parrot is BaseCreature {
    constructor(
        address _doubloon,
        address _merchant,
        uint256 _maxSupply,
        uint256 _exchangeRate
    ) ERC721("Parrots", "PARR") {
        doubloon = IERC20(_doubloon);
        merchant = _merchant;
        maxSupply = _maxSupply;
        exchangeRate = _exchangeRate;
    }
}
