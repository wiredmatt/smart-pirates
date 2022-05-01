// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./creatures/IBaseCreature.sol";

contract ItemsMarket {
    using SafeMath for uint256;

    mapping(uint256 => address) public listedItems;
    uint256 public itemId = 0;

    uint256 public constant LISTING_FEE = 0.1 ether;
    uint256 public constant SELL_COMISSION_RATE = 75; // what the merchant gets for each sell, out of 100%. The rest goes to the market owner

    address public admin;

    IERC20 public doubloon;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin only action");
        _;
    }

    constructor(address _doubloon) {
        admin = msg.sender;
        doubloon = IERC20(_doubloon);
    }

    function listItem(address _item) external payable {
        require(msg.value >= LISTING_FEE, "Send at least 0.1 ether");

        listedItems[itemId] = _item;

        itemId = itemId.add(1);
    }

    function buyCreature(uint256 _collectionId, uint256 _creatureId) external {
        IBaseCreature creatureCollection = IBaseCreature(
            listedItems[_collectionId]
        );

        require(
            creatureCollection.ownerOf(_creatureId) == address(this),
            "Creature not available in market"
        );

        doubloon.transferFrom(
            msg.sender,
            address(this),
            creatureCollection.getExchangeRate()
        ); // makes the payment from the user wallet

        creatureCollection.transferFrom(address(this), msg.sender, _creatureId); // sends the items from the marketplace to the user wallet

        doubloon.transfer(
            creatureCollection.getMerchant(),
            (creatureCollection.getExchangeRate() * SELL_COMISSION_RATE) / 100
        ); // merchant gets 75% of the DBL, the other 25% goes to the market owner
    }

    function withdrawEarnings(uint256 _amount) external onlyAdmin {
        doubloon.transfer(admin, _amount);
    }

    function getBalance() external view returns (uint256) {
        return doubloon.balanceOf(address(this));
    }
}
