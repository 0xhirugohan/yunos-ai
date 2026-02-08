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

## Setup Instruction

Basically the foundry source code at `/contracts/uniswap-interactions/` contains the interactions with Uniswap V4 to test before integrating it directly to frontend. Our main codebase located at `/apps/ai-client/` contains both the backend and frontend of the AI and interaction with web3 wallet. 

To setup `ai-client`: 

```terminal
$ cd ./apps/ai-client/
$ bun install
$ bun run dev
```

You need to provide `OPENROUTER_API_KEY` environment variable as its our interactions with AI.

Running `ai-client` in production environment:

```terminal
$ cd ./apps/ai-client
$ bun install
$ bun run build
$ bun run start
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
