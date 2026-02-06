import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useConnection } from "wagmi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatbotUI } from "./ChatbotUI";
import { config } from "./config";
import { Connection } from "./wallets/connection";
import { WalletOptions } from "./wallets/wallet-options";

import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useConnection();
  if (isConnected) return <Connection />;
  return <WalletOptions />;
}

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto p-8 text-center relative z-10">
	  <ConnectWallet />
          <div className="flex justify-center items-center gap-8 mb-8">
            <img
              src={logo}
              alt="Bun Logo"
              className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
            />
            <img
              src={reactLogo}
              alt="React Logo"
              className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] [animation:spin_20s_linear_infinite]"
            />
          </div>
          <Card>
            <CardHeader className="gap-4">
              <CardTitle className="text-3xl font-bold">Bun + React</CardTitle>
              <CardDescription>
                Edit <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">src/App.tsx</code> and save to
                test HMR
              </CardDescription>
            </CardHeader>
            <CardContent>
	      <ChatbotUI />
            </CardContent>
          </Card>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
