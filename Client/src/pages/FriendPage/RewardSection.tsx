import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LuGift } from "react-icons/lu";
import { API, apiErrorHandler } from "@/libs/API";

const RewardSection = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  const refresh = () => {
    API.get('/task/invite').then(res => {
      setTasks(res.data);
    }).catch(console.error);
  };

  useEffect(refresh, []);
  
  const claimReward = (id: string) => {
    API.post('/task/invite/claim', { id }).then(() => {
      toast.success('Claimed successfully.');
      refresh();
    }).catch(apiErrorHandler);
  }

  return (
    <Card className="space-y-2">
      <div className="flex items-center gap-2">
        <LuGift className="text-primary" />
        <span className="font-semibold">Invite Rewards</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task, key) => <div onClick={() => claimReward(task._id)} key={key} className={`flex items-center justify-between rounded-xl px-4 py-2 cursor-pointer hover:bg-black/15 ${task.isClaimed ? 'bg-black/15' : 'bg-black/5'} duration-300`}>
          <div className="flex items-center gap-2">
            <div className="text-xl">{task.isClaimed ? '✅' : '🎁'}</div>
            <div className="">
              <div className="font-semibold">{task.title}</div>
              <div className="text-muted text-sm">{task.reward.coin} Coins</div>
            </div>
          </div>
          {task.isClaimed ?
            <Badge className="bg-secondary text-white">Claimed</Badge> :
            task.isCompleted ?
              <Badge className="bg-tertiary text-white">Done</Badge> :
              <Badge className="bg-primary text-white">{task.target - task.current} more</Badge>
          }
        </div>)}
      </div>
    </Card>
  )
}

export default RewardSection;