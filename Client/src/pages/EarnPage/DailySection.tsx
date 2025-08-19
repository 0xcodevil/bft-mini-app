import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import { calculateProgress } from "@/libs/utils";
import { LuCalendar } from "react-icons/lu";

const DailySection = () => {
  const dailyTasks = [
    { id: 1, title: "Play 5 Games", reward: 200, progress: 3, total: 5, completed: false, icon: "🎮" },
    { id: 2, title: "Make 50 Matches", reward: 150, progress: 50, total: 50, completed: true, icon: "🔥" },
    { id: 3, title: "Use 3 Power-ups", reward: 100, progress: 1, total: 3, completed: false, icon: "⚡" },
    { id: 4, title: "Score 10,000 Points", reward: 300, progress: 7500, total: 10000, completed: false, icon: "🎯" },
  ];

  return (
    <Card>
      <h3 className="font-semibold mb-4 flex items-center">
        <LuCalendar className="mr-2 text-primary" size={20} />
        Daily Tasks
      </h3>

      <div className="space-y-2">
        {dailyTasks.map((task) => <div key={task.id} className={`p-4 rounded-xl ${task.completed ? "bg-black/15 " : "bg-black/5"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{task.icon}</span>
              <div>
                <p className="font-medium">{task.title}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{task.progress}/{task.total}</span>
                  <Badge>+{task.reward} coins</Badge>
                </div>
              </div>
            </div>
            {task.completed ?
              <Badge className="bg-secondary text-white">Done ✓</Badge> :
              <button className="bg-primary px-3 py-1 rounded-xl text-white cursor-pointer hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50" disabled={task.progress < task.total}>Claim</button>}
          </div>

          {!task.completed && <Progress value={calculateProgress(task.progress, task.total)} />}
        </div>
        )}
      </div>
    </Card>
  )
}

export default DailySection;