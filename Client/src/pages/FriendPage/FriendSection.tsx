import { useState, useEffect } from "react";
import { Avatar } from "@telegram-apps/telegram-ui";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LuTrophy, LuUsers } from "react-icons/lu";
import { API } from "@/libs/API";
import Utils from "@game/engine/utils/libs";

const FriendSection = () => {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    API.get('/user/friends').then(res => {
      setFriends(res.data);
    }).catch(console.error);
  }, []);

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuUsers className="text-primary" />
          <span className="font-semibold">My Safari Crew</span>
        </div>
        <Badge>{friends.length} friends</Badge>
      </div>
      <div className="space-y-2">
        {friends.map((friend, key) => <div key={key} className="flex items-center justify-between rounded-xl px-4 py-2 bg-black/5 hover:bg-black/15 transition-all duration-200">
          <div className="flex items-center gap-2">
            <Avatar src={friend.telegram.photoUrl} />
            <div className="">
              <div className="font-semibold">{friend.telegram.firstName} {friend.telegram.lastName}</div>
              <div className="text-muted text-sm">Lvl.{Utils.getLevel(friend.score.total)} • {friend.score.total.toLocaleString()}pts</div>
            </div>
          </div>
          <button className="cursor-pointer flex items-center justify-center gap-2 border border-black/10 rounded-xl px-2 py-1 hover:bg-primary hover:text-white transition-all duration-200">
            <LuTrophy />
            <span className="text-sm">Challenge</span>
          </button>
        </div>)}
      </div>
    </Card>
  )
}

export default FriendSection;