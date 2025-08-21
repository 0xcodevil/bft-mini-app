import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const ProgressSection = () => {
  return (
    <Card className="space-y-4">
      <div className="font-semibold">Today's Progress</div>
      <div className="text-sm space-y-2 text-[#362417]">
        <div className="flex justify-between items-center">
          <div className="">Games Played</div>
          <Badge>3/5</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="">Daily Tasks</div>
          <Badge>3/5</Badge>
        </div>
        <div className="flex justify-between items-center">
          <div className="">Friends Invited</div>
          <Badge>3/5</Badge>
        </div>
      </div>
    </Card>
  )
}

export default ProgressSection;