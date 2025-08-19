import Page from "@/components/Page";
import ConnectSection from "./ConnectSection";
import PackageSection from "./PackageSection";
import TransactionSection from "./TransactionSection";

const WalletPage = () => {
  return (
    <Page className="bg-gradient-to-b from-[#78543a] to-[#88b34d]">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Safari Wallet</h1>
        <p className="text-sm text-white/80">Manage your coins and connect your wallet</p>
      </div>
      <ConnectSection />
      <TransactionSection />
      <PackageSection />
    </Page>
  );
};

export default WalletPage;