import Card from "@/components/ui/Card";
import LeaderboardCard from "./LeaderboardCard";
import { LuCrown } from "react-icons/lu";

const AllTime = ({ users }: { users: any[] }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-tertiary/20 rounded-xl border border-tertiary">
        <h3 className="font-semibold mb-4 flex items-center">
          <LuCrown className="mr-2 text-yellow-500" size={20} />
          Hall of Fame
        </h3>
        <div className="space-y-3">
          {users.map(player => <LeaderboardCard key={player._id} player={player} showChange={false} />)}
        </div>
      </div>

      <Card>
        <p className="text-center text-sm text-muted">
          Keep playing to climb the all-time leaderboard!
        </p>
      </Card>
    </div>
  )
}

export default AllTime;