# UI DAO Example

```
Cartesi Rollups version: 1.5.x
```

## What is it?

This repository will help you spin up a simple UI for the DAO example. Here's a [demo video](https://x.com/riseandshaheen/status/1826965802664272008) on X to understand how it works. It will allow you to perform actions such as:

- Write a proposal
- Add ethereum address to notify
- Submit form data to Cartesi `InputBox` contract
- List all proposals

> **NOTE:**
> This UI needs Cartesi backend and XMTP-Relayer to be running in the background. Refer to the README.md files in the `backend-dao-example` and `relayer` folders to get started.

## How to run?

In the project directory, run:

```shell
yarn
yarn codegen
```

to build the app.

```shell
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



