## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
$ anvil --fork-url https://unichain-sepolia-rpc.publicnode.com
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
$ forge script ./script/CreatePool.s.sol --broadcast --rpc-url http://127.0.0.1:8545 --account local
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help

```

Deployment

```
== Logs ==                                                                                                                            
  PoolKey generated                                                                                                                   
  0x925d7ab165b4384b859639675dc491d901ff2fb280266d567a269a3fd0944395                                                                  
  =============                                                                                                                       
  PoolId                                                                                                                              
  0x925d7ab165b4384b859639675dc491d901ff2fb280266d567a269a3fd0944395                                                                  
  =============                                                                                                                       
  XAUY Address:                                                                                                                       
  0xE687db5641A7C6269d5cD14d43bf4304096239bF                                                                                          
  =============                                                                                                                       
  USDY Address:                                                                                                                       
  0x215d899341832F1bFD18D44734CbC57841dA24Ad                                                                                          
  =============
```
