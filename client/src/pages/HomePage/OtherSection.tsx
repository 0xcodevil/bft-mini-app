import { Link } from "react-router-dom";
import { LuTrophy, LuWallet } from "react-icons/lu";

const OtherSection = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link to="/leaderboard" className="flex justify-center items-center gap-4 text-sm font-semibold bg-white py-2 rounded-xl border border-[#d6cec2] hover:scale-105 hover:shadow-xl transition-all duration-200">
        <LuTrophy />
        <span>Leaderboard</span>
      </Link>
      <Link to="/wallet" className="flex justify-center items-center gap-4 text-sm font-semibold bg-white py-2 rounded-xl border border-[#d6cec2] hover:scale-105 hover:shadow-xl transition-all duration-200">
        <LuWallet />
        <span>Wallet</span>
      </Link>
    </div>
  )
}

export default OtherSection;