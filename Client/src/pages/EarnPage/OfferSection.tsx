import Card from "@/components/ui/Card";
import { LuGift } from "react-icons/lu";

const OfferSection = () => {
  return (
    <Card className="">
      <div className="flex items-start space-x-3">
        <LuGift size={32} className="text-secondary" />
        <div className="flex-1">
          <h4 className="font-semibold mb-2">Limited Time Offer! 🎉</h4>
          <p className="text-sm text-muted mb-3">
            Complete all daily tasks within 24 hours to unlock a special
            <span className="font-semibold text-primary"> Golden Safari Chest</span>!
          </p>
          <div className="text-xs text-muted">⏰ Expires in 18:42:15</div>
        </div>
      </div>
    </Card>
  )
}

export default OfferSection;