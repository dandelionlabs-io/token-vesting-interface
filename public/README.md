# Oxychain project use TypeScript & ReactJS web3

This repo is a template for web3 web applications in TypeScript and ReactJS, contains the basic functionality to manage wallet connection, account change, network change, and shows balances, including error control.

## About the source code

This is a TypeScript & ReactJS application.

- [Getting Started](#getting-started)
    - [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Requirements
You will need node.js (12.* or later) and npm installed to run it locally. We are using Hardhat to handle the project configuration and deployment. The configuration file can be found as `hardhat.config.js`.

1. Import the repository and `cd` into the new directory.
2. Run `yarn install`.
3. Copy the file `.env.example` to `.env`, and:
    - Replace `REACT_APP_INFURA_KEY` with an INFURA or ALCHEMY url.
    - Replace `REACT_APP_PORTIS_ID` with a Portid ID of the DApp.
    - Replace `REACT_APP_FORTMATIC_KEY` with a formtmatic apiKey
4. Run `yarn start`.

## Troubleshooting

If you have any questions, send them along with a hi to [hello@dandelionlabs.io](mailto:hello@dandelionlabs.io).
