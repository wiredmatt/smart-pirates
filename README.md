# Smart Pirates

## Setting things up

### Installing NodeJS

1. Install [NVM](https://github.com/nvm-sh/nvm#install--update-script) (Node Version Manager)

2. Install Node v14.15.0:

```
nvm install 14.15.0
```

3. Select Node v14.15.0:
```
nvm use 14.15.0
```

### Installing the Truffle Suite

1. Install truffle core:

```
npm i -g truffle
```

2. Install Ganache:

Download it from [here](https://trufflesuite.com/ganache/), this will be our local ethereum node, so keep the program opened while you are in local development.

### Setting env variables

Create a file with the name ".env" at the root of this project, and fill in the following variables:

```
PRIVATE_KEY_DEV=s0m3privatek3ythatyougetfromganach3
```
To get a private key from ganache, click on the key icon all the way to the right.
![ganache-private-keys](./docs/ganache-ss)

## Learn to develop smart contracts with pirates

Check the branches in this repository, they are numbered based on the level of complexity of each example. Switch to the branch of your interest, and you'll see a fully detailed example on how to implement it, not only that but there'll also be proper documentation explaining everything relevant.

