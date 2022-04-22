# Gold and Doubloons

## About

This is a simple implementation of [currencies](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/). 

In the era of pirates, `doubloons` were the common currency.

A [doubloon](https://en.wikipedia.org/wiki/Doubloon) is made out of `gold`.

`Gold` is found in `mines`.

You use `doubloons` to buy `bread`.

Find a mine -> look for gold -> find it -> melt it and get doubloons out of it -> buy bread.

## Set up

1. Create a `.env` file at the root of the project, populate the values according to what's in the `.env.example` file (you can leave it as is).

2. Install project dependencies:

```bash
yarn install 
```

## Contents

This project contains multiple Smart Contracts, [`Gold`](./contracts/Gold.sol), [`Doubloon`](./contracts/Doubloon.sol), [`GoldMine`](./contracts/GoldMine.sol) and [`Stone`](./contracts/Stone.sol)

## Inspecting the smart contracts

### Gold

#### Imports

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
```

There's something new here, an import!

As you already now, when we develop software we have tons of libraries and frameworks at our disposal, there's no need to reinvent the wheel, and this also applies for Smart Contracts

What you need to know is that `ERC20` is the standard for making a token, there are 5 things that are important to understand at first glance:

1. A token has a name, for example `Gold`
2. A token has a symbol, for example `GLD`
3. A token can be `*minted*` (in the case of gold, it would mean that someone found gold and mined it, in the case of USD dollars, it means that the money printer went brrrrrr), you basically create units of a token by minting them
4. A token can be `burned`, basically, you get a certain amount of tokens out of circulation, this is often done to fight inflation
5. A token can be `traded` for another token, in the same way that you can exchange USD for AUD you can `*swap*` ETH for WBTC, at a given market or fixed rate (for example: you can swap 1 ETH for 2973 USDC)

Note: in the case of point 4, we're using burn a little bit different, as you will see, by burning Gold you receive [doubloons](https://en.wikipedia.org/wiki/Doubloon) (Makes sense right? You need to melt gold in order to get a Doubloon)

### Allowed mines?

```solidity
mapping(address => bool) public allowedMines;
```

Well, Gold can only be found in Gold Mines right? Gold Mines will also be smart contracts! Take a glance at the [Gold Mine section](#gold-mine) if you'd like

Example:

```json
{
    "0xb5310ac8625aee8bf2c7B3AB8D10C2ddFb509443": true, // this is a gold mine! So gold can be found here
    "0x8DF2A31064337f276F32d963Ce7CcCf5E3aE6896": false // this one is not.
}
```

This way, the `mine` function can only be invoked from a `Gold Mine`

The rest that you'll see in this contract has to do with making a doubloon, gold can only be burned when using it to make a doubloon, that's it!

### Stone

Because when you mine, you might not always find gold :(.

### Gold Mine

```solidity
function lookForGold(uint256 spot) public payable {
    require(msg.value == EXPLORATION_FEE, "You should pay 0.1 ether");
    require(spot < spots.length, "Spot is out of bounds");

    if (spots[spot] == true) {
        gold.mine(msg.sender, 10);
        spots[spot] = false; // set spot as already mined.
    } else {
        stone.mine(msg.sender, 100);
    }
}
```

To be able to find some gold, you have to pay a fee (to use the equipment and the paths built beforehand, duh). This is why this function has the modifier `payable`, this means that when you call this function you should send a specified amount of ETH, if you send less you won't be able to enter the mine.

You should also choose a `spot` in which to look for some gold. Think of it this way:

```
 0  1  2  3  4  5  6  7  8  9
-------------------------------
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |
-------------------------------

```

A mine can have 9 paths in which to look for gold, you can only choose one at a time.

### Doubloon

So in order to make 100 Doubloons, you have to provide 1 Gold ingot.

```solidity
function makeDoubloon(uint256 goldAmount) external {
    require(goldAmount >= 0, "Provide at least 1 GOLD");
    require(
        gold.allowance(msg.sender, address(this)) >= goldAmount,
        "Approve to spend your gold"
    );

    gold.transferFrom(msg.sender, address(this), goldAmount);

    gold.meltGold(goldAmount);

    _mint(msg.sender, goldAmount * 100);
}
```

This function checks for an `allowance`. It's basically asking the Gold contract if the user really approves to burn a given amount of gold in exchange of doubloons. An allowance can be granted by calling the following function beforehand:

```solidity
function approveMakeDoubloon(uint256 goldAmount) external {
    require(goldAmount >= 0, "Provide at least 1 GOLD");
    gold.approve(address(this), goldAmount);
}
```

`approve` is an internal method of the ERC20 standard, it does exactly what was described before, it allows another contract to use your tokens on your behalf.

### Bread

Now with some doubloons you can buy bread!

```solidity
function bake() external {
    uint256 amount = doubloon.allowance(msg.sender, address(this)) * 10;
    doubloon.transferFrom(msg.sender, baker, amount); // pay the baker
    _mint(msg.sender, amount); // bake the bread
}

function startTrade(uint256 doubloons) external {
    doubloon.approve(address(this), doubloons);
}
```

To buy bread, one needs to *start the trade*, by allowing to use a given amount of doubloons

Then the bread will be baked, the pirate will receive 10 slices of bread for each doubloon paid!