import { useState, useEffect } from "react";
import { Avatar } from "@telegram-apps/telegram-ui";
import Card from "@/components/ui/Card";
import { LuShare2 } from "react-icons/lu";
import { API, apiErrorHandler } from "@/libs/API";
import { toast } from "react-toastify";
import { openLink, openTelegramLink } from "@telegram-apps/sdk-react";

const SocialSection = ({ setCoin }: { setCoin: (coin: number) => void }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  const refresh = () => {
    API.get('/task/social').then(res => {
      setTasks(res.data);
    }).catch(console.error);
  }

  useEffect(refresh, []);

  const doTask = (id: string, link: string ) => {
    if (link.startsWith('https://t.me/')) openTelegramLink(link);
    else openLink(link);
    API.post('/task/social', { taskId: id }).then(() => {
      refresh();
    }).catch(console.error);
  }

  const claimTask = (id: string) => {
    toast.success('Claimed successfully.');
    API.post('/task/social/claim', { taskId: id }).then((res) => {
      setCoin(res.data.coin);
      refresh();
    }).catch(apiErrorHandler);
  }

  return (
    <Card>
      <h3 className="font-semibold mb-4 flex items-center">
        <LuShare2 className="mr-2 text-primary" size={20} />
        Social Tasks
      </h3>

      <div className="space-y-2">
        {tasks.map((task, key) => <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${task.completed ? "bg-black/15" : "bg-black/5"}`}>
          <div className="flex items-center space-x-3">
            <Avatar size={24} src={task.icon} />
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">+{task.reward.coin} coins</p>
            </div>
          </div>

          {task.isCompleted ?
            task.isClaimed ?
              <button onClick={() => doTask(task._id, task.link)} className="px-3 py-1 rounded-xl cursor-pointer border border-black/5 hover:bg-tertiary transition-all duration-200">Visit</button> :
              <button onClick={() => claimTask(task._id)} className="bg-primary px-3 py-1 rounded-xl text-white cursor-pointer hover:bg-primary/90">Claim</button> :
            <button onClick={() => doTask(task._id, task.link)} className="px-3 py-1 rounded-xl cursor-pointer border border-black/5 hover:bg-tertiary transition-all duration-200">Complete</button>}
        </div>
        )}
      </div>
    </Card>
  )
}

export default SocialSection;