# The pirate Journal

## About

This is a simple implementation of [storage](https://ethereum.org/en/developers/docs/storage/). A blockchain is in esence, a public database, which is the perfect storage medium for pirates to record their journeys, so their tales won't die with themselves deep in the sea

## Set up

1. Create a `.env` file at the root of the project, populate the values according to what's in the `.env.example` file (you can leave it as is).

2. Install project dependencies:

```bash
yarn install 
```

## Contents

This project contains a single smart Contract, [`PirateJournal`](./contracts/PirateJournal.sol)

## Inspecting the smart contract

### License?

As you can see in the first line of the code there is a license specified, this is a code standard for smart contracts, you should choose yours wisely

```solidity
// SPDX-License-Identifier: MIT
```
If you're thinking *why?*: Because every smart contract is public in the blockchain, but that doesn't necessarily mean that whoever sees the code can copy and reuse it, or at least not under certain conditions, for example the MIT license tells its readers:

```
Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Meaning that whoever uses and modifies the code should leave the copyright notice and the original license. You can check all the available license and choose yours here at [choosealicense](https://choosealicense.com/licenses/)

In this case, this means that any pirate can freely copy the code and add more functionality to the contract!

### Structs

There are two `structs` defined in this contract, and as you can guess a `struct` is a custom type, many programming languages have this feature, for example [Typescript](https://www.typescriptlang.org/) and [Rust](https://www.rust-lang.org/), a `struct` is used only for **holding data**, it can't contain functions

```solidity
struct Pirate {
    string name;
    string surname;
    address publicKey;
}

struct JournalEntry {
    string title;
    string date;
    string text;
}
```

A `Pirate` has a `name` and a `surname`; but this is a smart pirate, so he also has a [web3 wallet](https://web3.hashnode.com/what-is-a-web3-wallet) which he uses to prove his identity and sign his journal entries!

A `JournalEntry` has a `title`, a `date` and its `text`

### Contract

You can think of a contract as a class, they are actually the exact same thing. A class has attributes and functions, and so does a Contract

For example, the `PirateJournal` contract has the followings:

- Attributes: 

    * `author`: The pirate that owns this journal
    * `entries`: A Hashmap that maps a `page number` with a `JournalEntry`, for example:
    
    ```json
    {
        1: {
            "title": "My Journey learning Solidity Begins",
            "date": "2022/04/20",
            "text": "Today I learned how to create a Smart Contract!"
        }
    }
    ``` 
- Functions:

    * `constructor`: a function that gets executed when the contract gets deployed, it receives the name and surname of the owner of the journal as parameters

    ```solidity
    constructor(string memory name, string memory surname) {
        author = Pirate(name, surname, msg.sender);
    }
    ```

    There is something interesting here, `msg.sender`, what is it? Well, in short, it is the address (public key) of the pirate deploying this contract! `msg` is a reserved keyword that stores many useful things when a function is called

    * `recordEntry`: This function adds content to a page in the journal (as you can guess, it can also modify the existing data if there was any in the specified page)

    ```solidity
    function recordEntry(
        uint256 page,
        string memory title,
        string memory date,
        string memory text
    ) external onlyAuthor {
        entries[page] = JournalEntry(title, date, text);
    }
    ```

    What's `external`? It is a [function modifier](https://www.tutorialspoint.com/solidity/solidity_function_modifiers.htm), that specifies that this function can only be called from outside of this contract, meaning that I couldn't call this function from another function

    What's `onlyAuthor`? This modifier checks that the one calling has the same public key as the one who created (deployed) this contract

## Hardhat

Hardhat is the ethereum development framework that was used for this project, for a quick overview on what you can do with it (and to understand the commands that we'll be running from now on), open the terminal and run the following command:

```bash
yarn hardhat help
```

There are a lot of `tasks` here, the ones that we will be using are the following ones:

1. `node`
2. `compile`
3. `create-journal`
4. `record-entry`
5. `read`
6. `set-keys`

To see what each of these do, run the command:

```bash
yarn hardhat help task # replace task with the actual name of the task that you wish to inspect 
```

## Creating a journal (deploying the smart contract)

To deploy a smart contract means to upload it to the blockchain, so other people (and even other contracts) can interact with it, in this case, once the contract is deployed, the pirate will be able to record journal entries that'll be stored in the blockchain

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

    2.2 Deploy it
    ```bash
    yarn hardhat create-journal Edward Newgate --network development # Feel free to replace Edward Newgate with your favourite pirate
    ```

    And that's it, you have created a new journal for Edward Newgate.

## Adding an entry to the journal

This is no pirate journal if it's empty, let's fill it with some adventures!

```bash
yarn hardhat record-entry 0x5FbDB2315678afecb367f032d93F642f64180aa3 1 "My journey learning Solidity begins" "2022/04/21" "Today I learned how to create a decentralized journal to record my adventures!" --network development # replace the first argument with the address to which the journal was deployed to, you can check it in the file logs/deploy-development.log.json
```

## Reading the entries of the journal

To see what has been written in a page, run the following command:

```bash
yarn hardhat read 0x5FbDB2315678afecb367f032d93F642f64180aa3 1 --network development # remember to replace the address and the page number
```

## Adding another pirate, and creating a new journal for him

To add a new pirate get a new pair of keys from those that `yarn hardhat node` gives you, and run the following command:

```bash 
yarn hardhat set-keys 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 # privatekey publickey
```

Now you can repeat the process 

1. Create journal
2. Add entries
3. Read the entries
