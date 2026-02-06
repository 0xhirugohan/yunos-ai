import * as React from "react";
import { Connector, useConnect, useConnectors } from "wagmi";

import { Button } from "@/components/ui/button";

export function WalletOptions() {
  const { connect } = useConnect();
  const connectors = useConnectors();

  return connectors.map((connector) => (
    <Button key={connector.uid} onClick={() => connect({ connector })}>
      Connect with <strong>{connector.name}</strong>
    </Button>
  ));
}
