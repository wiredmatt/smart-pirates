// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stone is ERC20 {
    
    constructor() ERC20("Stone", "STN") {}

    function mine(address minerAddress, uint256 amount) external {
        _mint(minerAddress, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
