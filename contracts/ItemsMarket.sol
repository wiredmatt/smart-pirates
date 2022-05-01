// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./items/IBaseItem.sol";

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

    function buyItem(uint256 _itemId, uint256 _amount) external {
        IBaseItem item = IBaseItem(listedItems[_itemId]);

        require(
            item.balanceOf(address(this)) >= _amount,
            "Order exceeds item supply"
        );

        uint256 total = _amount * item.getExchangeRate();

        doubloon.transferFrom(msg.sender, address(this), total); // makes the payment from the user wallet

        item.transfer(address(this), _amount); // sends the items from the marketplace to the user wallet

        doubloon.transfer(
            item.getMerchant(),
            (total * SELL_COMISSION_RATE) / 100
        ); // merchant gets 75% of the DBL, the other 25% goes to the market owner
    }

    function withdrawEarnings(uint256 _amount) external onlyAdmin {
        doubloon.transfer(admin, _amount);
    }

    function getBalance() external view returns (uint256) {
        return doubloon.balanceOf(address(this));
    }
}
