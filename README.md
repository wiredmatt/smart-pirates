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

This project contains multiple Smart Contracts, [`Gold`](./contracts/Gold.sol), [`Doubloon`](./contracts/Doubloon.sol), [`GoldMine`](./contracts/GoldMine.sol), [`Stone`](./contracts/Stone.sol) and [`Bread`](./contracts/Bread.sol)

## Inspecting the smart contracts

### Gold

#### Imports

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
```

There's something new here, an import!

As you already know, when we develop software we have tons of libraries and frameworks at our disposal, there's no need to reinvent the wheel, and this also applies for Smart Contracts

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

Because when you mine, you might not always find gold :(

### Gold Mine

```solidity
function lookForGold(uint256 spot) public payable {
    require(msg.value == EXPLORATION_FEE, "You should pay 0.1 ether");
    require(spot < spots.length, "Spot is out of bounds");

    if (spots[spot] == true) {
        gold.mine(msg.sender, 1);
        spots[spot] = false; // set spot as already mined.
    } else {
        stone.mine(msg.sender, 100);
    }
}
```

To be able to find some gold, you have to pay a fee (to use the equipment and the paths built beforehand, duh). This is why this function has the modifier `payable`, this means that when you call this function you should send a specified amount of ETH, if you send less you won't be able to enter the mine

You should also choose a `spot` in which to look for some gold. Think of it this way:

```
 0  1  2  3  4  5  6  7  8  9
-------------------------------
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |
-------------------------------

```

A mine can have 9 paths in which to look for gold, you can only choose one at a time

### Doubloon

So in order to make 100 Doubloons, you have to provide 1 Gold ingot.

```solidity
function makeDoubloon(uint256 goldAmount) external {
    require(goldAmount > 0, "Provide at least 1 GOLD");
    require(
        gold.allowance(msg.sender, address(this)) >= goldAmount,
        "Approve to spend your gold"
    );

    gold.transferFrom(msg.sender, address(this), goldAmount);

    gold.meltGold(goldAmount);

    _mint(msg.sender, goldAmount * 100);
}
```

This function checks for an `allowance`. It's basically asking the Gold contract if the sender really approves for his Gold ingots to be used by this contract. An allowance can be granted by calling the following function beforehand:

```solidity
gold.approve(0x3Aa5ebB10DC797CAC828524e59A333d0A371443c, goldAmount);
```

`approve` is an internal method of the ERC20 token, it does exactly what was described before, it allows another contract to use your tokens on your behalf

### Bread

Now with some doubloons you can buy bread!

```solidity
function buy() external {
    uint256 amount = doubloon.allowance(msg.sender, address(this));
    require(amount > 0, "Start the trade first");
    
    doubloon.transferFrom(msg.sender, baker, amount); // pay the baker
        
    _mint(msg.sender, amount * 10); // receive 10 slices of bread for each doubloon
}
```

To buy bread, one needs to *start the trade*, by allowing to use a given amount of doubloons

Then the bread will be baked, the pirate will receive 10 slices of bread for each doubloon paid!

## Hardhat

Hardhat is the ethereum development framework that was used for this project, for a quick overview on what you can do with it (and to understand the commands that we'll be running from now on), open the terminal and run the following command:

```bash
yarn hardhat help
```

There are a lot of `tasks` here, the ones that we will be using are the following ones:

1. `node`
2. `compile`
3. `create-gold`
4. `create-doubloon`
5. `create-stone`
6. `open-gold-mine`
7. `look-for-gold`
8. `make-doubloons`
9. `buy-bread`

To see what each of these do, run the command:

```bash
yarn hardhat help task # replace task with the actual name of the task that you wish to inspect 
```

## Creating the tokens (deploy ERC-20 tokens)

To deploy a smart contract means to upload it to the blockchain, so other people (and even other contracts) can interact with it, in this case, once the contract is deployed, `Gold`, `Doubloon` and `Stone` will be public assets in the blokchain.

### Steps

1. Spin up an ethereum node, for this you can do it in two ways:

    1.1 Open a new terminal and run (recommended)
    ```bash
    yarn hardhat node
    ``` 

    2.2 Let the node run in the background
    ```bash
    yarn hardhat node & sleep 5
    ```

2. In your main terminal, run the following commands:

    2.1 Compile the contract
    ```bash
    yarn hardhat compile
    ```

    2.2 Deploy the tokens
    ```bash
    yarn hardhat create-gold --network development
    yarn hardhat create-doubloon --network development
    yarn hardhat create-stone --network development
    ```

    And that's it, you have created 3 ERC-20 tokens in the blockchain.

## Openning a Gold Mine

To be able to get gold, one must open a Mine first

```bash
yarn hardhat open-gold-mine --network development
```

## Getting Gold (or stones?)

In order to buy ale, bread and ships, a pirate must find some gold first

```bash
yarn hardhat look-for-gold 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 1 --network development # the first argument is the address of the mine in which you want to search for gold, and the second one the spot in where to look for it. 
```

Try changing the `spot` until you get some gold, you can keep the stones!

## Getting Doubloons

Well, you can't exactly pay for bread with a gold ingot, so you must melt it first and get some doubloons out of it

```bash
yarn hardhat make-doubloons 1 --network development # if you found more than 1 gold ingot, feel free to spend more gold
```

## Buying bread (finally)

That was tedious, but it's how coins are made, you can't just drop in a bar with a gold ingot and ask for bread, what are they going to give you for change? The entire bar?

```bash
yarn hardhat create-bread --network development
yarn hardhat buy-bread 1 --network development # pay with 1 doubloon to get 10 slices of fine bread.
```
