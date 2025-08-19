import { LuTrophy } from "react-icons/lu";

const InfoSection = () => {
  return (
    <div className="p-4 rounded-xl bg-primary/10 border border-primary">
      <div className="flex items-start space-x-3">
        <LuTrophy size={24} className="text-primary" />
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Weekly Rewards</h4>
          <ul className="text-sm text-black space-y-1">
            <li>🥇 1st Place: 5000 coins + Special Badge</li>
            <li>🥈 2nd Place: 3000 coins + Power-up Pack</li>
            <li>🥉 3rd Place: 2000 coins + Coin Boost</li>
            <li>🏆 Top 10: 1000 coins</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InfoSection;