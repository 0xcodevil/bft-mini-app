import '@rainbow-me/rainbowkit/styles.css';
import { lightTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider as Provider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'Wallet',
  projectId: '324e581391c7c9cf2ec6c447f1705784',
  chains: [mainnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default WagmiProvider;