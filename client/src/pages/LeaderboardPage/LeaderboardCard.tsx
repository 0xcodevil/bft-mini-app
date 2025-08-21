import Badge from "@/components/ui/Badge";
import { initDataUser } from "@telegram-apps/sdk-react";
import { Avatar } from "@telegram-apps/telegram-ui";
import { LuAward, LuCrown, LuMedal } from "react-icons/lu";
import Utils from "@game/engine/utils/libs";

const getChangeColor = (change: string) => {
  if (change.startsWith('+')) return "text-green-500";
  if (change.startsWith('-')) return "text-red-500";
  return "text-muted-foreground";
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <LuCrown className="text-yellow-500" size={24} />
  if (rank === 2) return <LuMedal className="text-gray-400" size={24} />
  if (rank === 3) return <LuAward className="text-amber-600" size={24} />
  return <span className="text-lg font-bold text-muted">#{rank}</span>;
};

const LeaderboardCard = ({ player, showChange = false }: { player: any; showChange?: boolean }) => {
  const user = initDataUser()!;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${player.isPlayer
        ? "bg-primary/10 border-2 border-primary"
        : "bg-white hover:bg-[#F0EEEA]"
        }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 flex justify-center">
          {getRankIcon(player.rank)}
        </div>
        <Avatar src={player.telegram.photoUrl} />

        <div>
          <div className="flex items-center space-x-2">
            <p className={`font-semibold ${player.telegram.id == user.id ? "text-primary" : ""}`}>{player.telegram.firstName} {player.telegram.lastName}</p>
            {player.telegram.id == user.id && <Badge className="bg-primary text-white">You</Badge>}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted">
            <span>Level {Utils.getLevel(player.target)}</span>
            <span>•</span>
            <span>{player.target.toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      {showChange && player.change && <div className={`text-sm font-medium ${getChangeColor(player.change)}`}>{player.change}</div>}
    </div>
  )
}

export default LeaderboardCard;