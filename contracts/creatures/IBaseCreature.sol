// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IBaseCreature is IERC721Enumerable {
    function getExchangeRate() external view returns (uint256);
    function getMerchant() external view returns (address);
}
