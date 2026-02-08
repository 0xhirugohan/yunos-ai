import {
  useBalance,
  useConnection,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useReadContracts,
} from "wagmi";
import { erc20Abi, formatUnits } from "viem";

import { Button } from "@/components/ui/button";

export function Connection() {
  const { address } = useConnection();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const { data: xauy } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: "0xE687db5641A7C6269d5cD14d43bf4304096239bF",
	abi: erc20Abi,
	functionName: "decimals",
      },
      {
        address: "0xE687db5641A7C6269d5cD14d43bf4304096239bF",
	abi: erc20Abi,
	functionName: "name",
      },
      {
        address: "0xE687db5641A7C6269d5cD14d43bf4304096239bF",
	abi: erc20Abi,
	functionName: "symbol",
      },
      {
        address: "0xE687db5641A7C6269d5cD14d43bf4304096239bF",
	abi: erc20Abi,
	functionName: "balanceOf",
	args: [address],
      },

    ]
  });

  const { data: usdy } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: "0x215d899341832F1bFD18D44734CbC57841dA24Ad",
	abi: erc20Abi,
	functionName: "decimals",
      },
      {
        address: "0x215d899341832F1bFD18D44734CbC57841dA24Ad",
	abi: erc20Abi,
	functionName: "name",
      },
      {
        address: "0x215d899341832F1bFD18D44734CbC57841dA24Ad",
	abi: erc20Abi,
	functionName: "symbol",
      },
      {
        address: "0x215d899341832F1bFD18D44734CbC57841dA24Ad",
	abi: erc20Abi,
	functionName: "balanceOf",
	args: [address],
      },

    ]
  });

  return (
    <div className="flex flex-col gap-y-4">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      <div className="p-2 border rounded-md">
        {address && <div>{ensName ? `${ensName} (${address})` : `${address.substr(0, 6)}...${address.substr(-6)}`}</div>}
      </div>
      {balance && 
        <div>
          {Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(5)} {balance.symbol}
        </div>
      }
      <div className="border rounded-sm">
        <p className="font-semibold">Assets</p>

        <div className="m-4 grid grid-cols-3 gap-4">
	  {balance && 
	    <div className="col-span-2">
	      {Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(5)}
	    </div>
	  }
	  {balance && <div>{balance.symbol}</div>}

	  {xauy && <div className="col-span-2">
	    {Number.parseFloat(formatUnits(xauy[3], xauy[0])).toFixed(5)}
	  </div>}
	  {xauy && <div>{xauy[1]}</div>}

	  {usdy && <div className="col-span-2">
	    {Number.parseFloat(formatUnits(usdy[3], usdy[0])).toFixed(5)}
	  </div>}
	  {usdy && <div>{usdy[1]}</div>}
	</div>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <Button>Swap to XAUY</Button>
        <Button>Swap to USDY</Button>
      </div>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
}
