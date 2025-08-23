import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { LuWallet, LuShield, LuCopy, LuCheck } from "react-icons/lu";
import { initDataUser, openLink } from "@telegram-apps/sdk-react";
import { API } from "@/libs/API";

const ConnectSection = () => {
  const user = initDataUser()!;
  const [coin, setCoin] = useState(0);
  const [bftBalance, setBftBalance] = useState(0);
  const [bbftBalance, setBbftBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConnectWallet = () => {
    openLink(location.origin + '/wallet-connect?tg=' + user.id);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b8f9a2");
      setCopied(true);
      setTimeout(setCopied, 2000, false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    API.get('/wallet/check').then(res => {
      setAddress(res.data.address);
    }).catch(console.error);
    API.get('/wallet/balance').then(res => {
      setBftBalance(Number(res.data.bft));
      setBbftBalance(Number(res.data.bbft));
    }).catch(console.error);
    API.get('/user/balance').then(res => {
      setCoin(res.data.coin);
    }).catch(console.error);
  }, []);

  return (
    <>
      <div className="p-6 rounded-xl bg-primary border border-white text-center text-white">
        <div className="text-center text-primary-foreground">
          <LuWallet size={48} className="mx-auto mb-4" />
          <div className="">
            <h2 className="text-2xl font-bold">Total Balance</h2>
            <div className="text-4xl font-bold">{coin.toLocaleString()}</div>
            <p className="text-lg opacity-90">Safari Coins</p>
          </div>

          {address && <div className="mt-4 p-3 bg-white/20 rounded-xl">
            <p className="text-sm opacity-80 mb-1">Connected Wallet:</p>
            <div className="flex items-center justify-center space-x-2">
              <p className="font-mono text-sm">{address.slice(0, 8)}...{address.slice(-6)}</p>
              <button onClick={handleCopyAddress} className="p-1 rounded-full text-white hover:bg-white/20">
                {copied ? <LuCheck size={16} /> : <LuCopy size={16} className="cursor-pointer" />}
              </button>
            </div>
          </div>}
        </div>
      </div>

      {address ? (
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center pt-6 pb-4 space-y-2 bg-tertiary rounded-xl cursor-pointer transition-all duration-200">
            <img src="/imgs/bft.jpg" className="w-10 h-10 rounded-full" alt="" />
            <span className="font-bold leading-none">$BFT</span>
            <span className="leading-none">{bftBalance.toLocaleString()}</span>
          </button>
          <button className="flex flex-col items-center pt-6 pb-4 space-y-2 bg-tertiary rounded-xl cursor-pointer transition-all duration-200">
            <img src="/imgs/logo.jpg" className="w-10 h-10 rounded-full" alt="" />
            <span className="font-bold leading-none">$BBFT</span>
            <span className="leading-none">{bbftBalance.toLocaleString()}</span>
          </button>
        </div>
      ) : (
        <Card className="space-y-4">
          <h3 className="font-semibold flex items-center">
            <LuShield className="mr-2 text-primary" size={20} />
            Connect Your Wallet
          </h3>

          <button onClick={handleConnectWallet} className="w-full flex items-center justify-center py-2 rounded-xl text-white text-lg font-semibold bg-primary cursor-pointer hover:opacity-90 transition-opacity">Connect</button>

          <div className="p-4 bg-accent/10 rounded-xl border border-accent">
            <div className="flex items-start space-x-2">
              <LuShield size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Why connect a wallet?</p>
                <p>Connect your wallet to withdraw coins, participate in NFT events, and secure your assets on the blockchain.</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

export default ConnectSection;