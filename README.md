# Linear Token vesting management & claiming platform

This repository contains the frontend for Linear Token Vesting project. This set of HTML pages that have been created to interact with the vesting process after any ERC20 crowdsale that would require linear vesting.

### Pre-requirements:

Before you setup the website, you should do the following steps first:

1. Deploy the contracts.
2. Run the sync node: [linear-vesting-sync](https://github.com/dandelionlabs-io/linear-vesting-sync)

> The instructions about how to deploy the smart contracts are in the _linear-vesting-contracts_ repository.
> The instructions about how to run the sync bot is in _linear-vesting-sync_ repository.

## About the source code

The source code in this repo has been created based on Web3 Modal Javascript library that allows to connect multiple Wallets into the Website.

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Requirements

You will need node.js (12.\* or later) and npm installed to run it locally.

1. Import the repository and `cd` into the new directory.
2. Run `npm install`.
3. Edit the **linearVestingConfig** variable in `js/config.js` with the correct Smartcontract addresses:
   - The Config is the Object of Key-value storage.
   - Keys are the Chain IDs.
   - Values are the list of Smartcontract addresses.
   - Value `degen.address` is XP token address.
     Add the Config for appropriate Chain ID that you wish to connect to.
4. Edit the linearVestingSyncURL variable in `js/config.js` with correct Degen Sync bot.
5. Finally Run the Server: `npm run start`.
6. To visit Manager's website, visit: `https://localhost/manager.html`.

## Troubleshooting

If you have any questions, send them along with a hi to hello@dandelionlabs.io.
