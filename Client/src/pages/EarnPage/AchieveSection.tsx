import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import { calculateProgress } from "@/libs/utils";
import { LuStar, LuTrophy } from "react-icons/lu";

const AchieveSection = () => {
  const achievements = [
    { title: "Safari Explorer", desc: "Complete 10 levels", progress: 8, total: 10, reward: 1000 },
    { title: "Match Master", desc: "Make 1000 matches", progress: 750, total: 1000, reward: 1500 },
    { title: "Big Five Hunter", desc: "Collect all Big Five animals", progress: 4, total: 5, reward: 2000 },
  ];

  return (
    <Card>
      <h3 className="font-semibold mb-4 flex items-center">
        <LuTrophy className="mr-2 text-primary" size={20} />
        Achievements
      </h3>

      <div className="space-y-2">
        {achievements.map((achievement, index) => (
          <div key={index} className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <LuStar size={24} className="text-primary" />
                <div>
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-sm text-muted">{achievement.desc}</p>
                </div>
              </div>
              <Badge className="border-primary text-primary">+{achievement.reward}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {achievement.progress}/{achievement.total}</span>
                <span>{Math.round(calculateProgress(achievement.progress, achievement.total))}%</span>
              </div>
              <Progress value={calculateProgress(achievement.progress, achievement.total)} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AchieveSection;