import { useState, useEffect } from "react";
import { initDataUser } from "@telegram-apps/sdk-react";
import { Avatar } from "@telegram-apps/telegram-ui";
import Card from "@/components/ui/Card";
import Utils from "@game/engine/utils/libs";
import { API, apiErrorHandler } from "@/libs/API";

const ProfileSection = () => {
  const tg = initDataUser()!;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get('/user/me').then(res => setUser(res.data)).catch(apiErrorHandler);
  }, []);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar size={48} src={tg.photo_url} />
        <div className="leading-none">
          <div className="text-lg font-bold">{tg.first_name} {tg.last_name}</div>
          {user ?
            <div className="text-muted">Level {Utils.getLevel(user.score.total)} • 7 day streak</div> :
            <div className="text-muted">---</div>}
        </div>
      </div>
      <div className="grid grid-cols-3 justify-items-center text-center">
        <div className="">
          <div className="text-primary font-bold text-xl">{user ? user.coin.toLocaleString() : '---'}</div>
          <div className="text-muted text-sm">Coins</div>
        </div>
        <div className="">
          <div className="text-secondary font-bold text-xl">{user ? user.score.total.toLocaleString() : '---'}</div>
          <div className="text-muted text-sm">Best Score</div>
        </div>
        <div className="">
          <div className="text-tertiary font-bold text-xl">#{'---'}</div>
          <div className="text-muted text-sm">Rank</div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileSection;