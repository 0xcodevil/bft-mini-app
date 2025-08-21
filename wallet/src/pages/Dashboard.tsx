import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { API, apiErrorHandler } from "../libs/API";

const Dashboard = () => {
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('tg');

  const handleConnect = () => {
    if (!account.isConnected || !account.address) return toast.error('Please connect wallet first.');

    API.post('/wallet/request', { address: account.address }).then(res => {
      const message = res.data.message;
      return signMessageAsync({ message });
    }).then(signature => {
      return API.post('/wallet/sign', {
        telegramId: id,
        address: account.address,
        signature: signature,
      });
    }).then(() => {
      toast.success('Wallet connected.');
    }).catch(apiErrorHandler);
  }

  return (
    <div className="min-h-screen pt-5 pb-20">
      <div className="px-4 max-w-md mx-auto space-y-4">
        <div className="flex flex-col items-center justify-center gap-5">
          <img src="/wallet-connect/imgs/logo.jpg" className="w-20 h-20 rounded-full" alt="" />

          <ConnectButton showBalance={false} />

          {account.isConnected && <button onClick={handleConnect} className="flex justify-center items-center w-40 h-10 bg-white rounded-[12px] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] cursor-pointer hover:scale-[102%] active:scale-95 duration-200 font-bold">Connect to BFT</button>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;