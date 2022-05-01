// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Gold.sol";
import "./Stone.sol";

contract GoldMine {
    uint256 public constant EXPLORATION_FEE = 0.1 ether;
    bool[] public spots;
    Gold public gold;
    Stone public stone;

    //               spot   , gold or stone
    event FoundAsset(uint256, bool);

    constructor(
        address _gold,
        address _stone,
        bool[] memory _spots
    ) {
        gold = Gold(_gold);
        stone = Stone(_stone);
        spots = _spots;
    }

    function lookForGold(uint256 spot) public payable {
        require(msg.value >= EXPLORATION_FEE, "You should pay 0.1 ether");
        require(spot < spots.length, "Spot is out of bounds");

        if (spots[spot] == true) {
            gold.mine(msg.sender, 1);
            spots[spot] = false; // set spot as already mined.
            emit FoundAsset(spot, true);
        } else {
            stone.mine(msg.sender, 100);
            emit FoundAsset(spot, false);
        }
    }
}
