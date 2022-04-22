// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Gold is ERC20, ERC20Burnable {
    mapping(address => bool) public allowedMines;
    address public doubloon;

    constructor() ERC20("Gold", "GLD") {}

    modifier isGoldMine() {
        require(allowedMines[msg.sender] == true, "Mine not allowed");
        _;
    }

    modifier isDoubloonMaker() {
        require(msg.sender == doubloon, "Can only melt to make doubloons");
        _;
    }

    function setDoubloonMaker (address _dobuloon) external {
        require(doubloon == address(0), "Doubloon already set");
        doubloon = _dobuloon;
    }

    function allowGoldMine (address _goldMine) external {
        allowedMines[_goldMine] = true;
    }

    function mine(address minerAddress, uint256 amount) external isGoldMine {
        _mint(minerAddress, amount);
    }

    function meltGold(uint256 amount) external isDoubloonMaker {
        //when making a Doubloon
        _burn(msg.sender, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
