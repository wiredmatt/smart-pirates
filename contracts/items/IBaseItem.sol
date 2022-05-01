// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBaseItem is IERC20 {
    function getExchangeRate() external view returns (uint256);

    function getMerchant() external view returns (address);
}