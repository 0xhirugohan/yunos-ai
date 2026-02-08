import { createConfig, http } from "wagmi";
import { unichainSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [unichainSepolia],
  connectors: [
    // injected(),
  ],
  transports: {
    [unichainSepolia.id]: http(),
  },
});
