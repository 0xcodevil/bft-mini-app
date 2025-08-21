import { useState, useEffect } from "react";
import Page from "@/components/Page";
import Weekly from "./Weekly";
import Monthly from "./Monthly";
import AllTime from "./AllTime";
import { LuTrophy } from "react-icons/lu";
import InfoSection from "./InfoSection";
import { API, apiErrorHandler } from "@/libs/API";

const LeaderboardPage = () => {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'total'>('weekly');
  
  const [count, setCount] = useState(0);
  const [me, setMe] = useState<any>();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    API.get('/user/count').then(res => {
      setCount(res.data.count);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    API.get('/user/ranking/' + tab).then(res => {
      setMe(res.data.me);
      setUsers(res.data.users);
    }).catch(apiErrorHandler);
  }, [tab]);

  return (
    <Page className="bg-gradient-to-b from-[#75c7f0] to-[#dbba57]">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-black/80">Compete with safari explorers worldwide!</p>
      </div>

      <div className="p-6 rounded-xl bg-primary border border-white text-center text-white">
        <LuTrophy size={48} className="mx-auto mb-4" />
        <div className="">
          <h2 className="text-2xl font-bold">Your Rank</h2>
          <div className="text-4xl font-bold">#{me?.rank}</div>
          <p className="text-lg opacity-90">You're in the top{me?.rank > 1 && count > 0 ? ` ${me.rank / count * 100}%` : ''}! 🔥</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 bg-[#e5e1dc] rounded-xl p-1 text-sm">
          <div onClick={() => setTab('weekly')} className={`cursor-pointer text-center rounded-xl py-1.5 transition-all duration-200 ${tab === 'weekly' ? 'bg-white font-semibold' : 'font-semibold text-muted'}`}>Weekly</div>
          <div onClick={() => setTab('monthly')} className={`cursor-pointer text-center rounded-xl py-1.5 transition-all duration-200 ${tab === 'monthly' ? 'bg-white font-semibold' : 'font-semibold text-muted'}`}>Monthly</div>
          <div onClick={() => setTab('total')} className={`cursor-pointer text-center rounded-xl py-1.5 transition-all duration-200 ${tab === 'total' ? 'bg-white font-semibold' : 'font-semibold text-muted'}`}>All Time</div>
        </div>

        {tab === 'weekly' && <Weekly users={users} />}
        {tab === 'monthly' && <Monthly users={users} />}
        {tab === 'total' && <AllTime users={users} />}
      </div>

      <InfoSection />
    </Page>
  );
};

export default LeaderboardPage;