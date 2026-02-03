# yunos-ai

Part of ETHGlobal's HackMoney2026 Hackathon

## Sponsors Applied

### Uniswap Foundation

We are utilizing Uniswap v4's AMM to hedge the user fund through swap, limit order, and possibly providing liquidity.

Requirement:

- TxID transactions => we might provide web interface to show list of TxID transactions done by the agents
- Setup intructions => will be done here, in the README.md
- Demo video max 3 mins => will be uploaded through ETHGlobal's dashboard and YouTube as backup

### ENS

We are trying to utilize the use of ENS, for example to manage address more friendly to the user, we might use ENS for the agent and for the user's wallet. Basically each agent has its own ENS, and user's managed wallet will also has its own ENS.

## Installing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
