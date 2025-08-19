import Card from "@/components/ui/Card";
import LeaderboardCard from "./LeaderboardCard";
import { LuStar } from "react-icons/lu";

const Weekly = ({ users }: { users: any[] }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-tertiary/20 rounded-xl border border-tertiary">
        <h3 className="font-semibold mb-4 flex items-center">
          <LuStar className="mr-2 text-primary" size={20} />
          This Week's Champions
        </h3>
        <div className="space-y-3">
          {users.slice(0, 3).map(player => <LeaderboardCard key={player._id} player={player} />)}
        </div>
      </div>

      {users.length > 3 && <Card className="space-y-3">
        {users.slice(3).map(player => <LeaderboardCard key={player._id} player={player} />)}
      </Card>}
    </div>
  )
}

export default Weekly;