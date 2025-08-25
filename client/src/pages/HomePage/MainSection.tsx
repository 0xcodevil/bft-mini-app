import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { LuCalendar, LuGift, LuPlay, LuUsers } from "react-icons/lu";
import { API } from "@/libs/API";

const MainSection = () => {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    API.get('/check-in/check').then(res => {
      setCheck(res.data.claimable);
    }).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link to="/game">
        <Card className="relative flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-200">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <LuPlay size={24} color="white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">Play Game</div>
            <div className="text-xs text-muted">Continue your adventure</div>
          </div>
        </Card>
      </Link>
      <Link to="/checkin">
        <Card className="relative flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-200">
          {check && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <LuCalendar size={24} color="white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">Daily Check-in</div>
            <div className="text-xs text-muted">Claim your daily reward</div>
          </div>
        </Card>
      </Link>
      <Link to="/friends">
        <Card className="relative flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-200">
          <div className="w-10 h-10 bg-tertiary rounded-full flex items-center justify-center">
            <LuUsers size={24} color="white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">Invite Friends</div>
            <div className="text-xs text-muted">Share the adventure</div>
          </div>
        </Card>
      </Link>
      <Link to="/earn">
        <Card className="relative flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-200">
          <div className="w-10 h-10 bg-[#88b34d] rounded-full flex items-center justify-center">
            <LuGift size={24} color="white" />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold">Earn Rewards</div>
            <div className="text-xs text-muted">Complete tasks for coins</div>
          </div>
        </Card>
      </Link>
    </div>
  )
}

export default MainSection;