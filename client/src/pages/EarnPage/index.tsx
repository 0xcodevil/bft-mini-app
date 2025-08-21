import { useState, useEffect } from "react";
import Page from "@/components/Page";
import { LuCoins } from "react-icons/lu";
import { API } from "@/libs/API";
// import DailySection from "./DailySection";
import SocialSection from "./SocialSection";
// import AchieveSection from "./AchieveSection";
// import OfferSection from "./OfferSection";

const EarnPage = () => {
  const [coin, setCoin] = useState(0);

  useEffect(() => {
    API.get('/user/balance').then(res => {
      setCoin(res.data.coin);
    }).catch(console.error);
  }, []);


  return (
    <Page className="bg-primary">
      <div className="text-center text-white space-y-2">
        <h1 className="text-2xl font-bold">Earn Rewards</h1>
        <p className="text-sm text-white/80">Complete tasks and challenges for amazing prizes!</p>
      </div>

      <div className="p-4 rounded-xl bg-tertiary border border-white/50">
        <div className="flex flex-col items-center">
          <LuCoins size={36} />
          <h2 className="text-2xl font-bold mb-1">{coin.toLocaleString()} Coins</h2>
          <p className="text-sm opacity-80">Your Safari Treasure</p>
        </div>
      </div>

      {/* <DailySection /> */}
      <SocialSection setCoin={setCoin} />
      {/* <AchieveSection /> */}
      {/* <OfferSection /> */}

    </Page>
  )
}

export default EarnPage;