import Badge from "@/components/ui/Badge";
import { LuTrophy } from "react-icons/lu";

const ArchievementSection = () => {
  return (
    <div className="border border-[#dbba57] bg-[#dbba571a] rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-white">
        <LuTrophy />
        <div className="font-semibold">Recent Achievement</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-4xl">🏆</div>
          <div className="">
            <div className="font-semibold">Match Master!</div>
            <div className="text-xs text-muted">Made 500 successful matches</div>
          </div>
        </div>
        <Badge className="text-white">+1000 coins</Badge>
      </div>
    </div>
  )
}

export default ArchievementSection;