import Badge from "@/components/ui/Badge";
import { LuCreditCard } from "react-icons/lu";

const PackageSection = () => {
  return (
    <div className="p-4 rounded-xl bg-tertiary/20 border border-tertiary">
      <h3 className="font-semibold mb-4 flex items-center">
        <LuCreditCard className="mr-2 text-tertiary" size={20} />
        Coin Packages
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded-lg border border-tertiary text-center">
          <div className="text-2xl mb-2">👛</div>
          <p className="font-semibold">1,000 Coins</p>
          <p className="text-sm text-muted">$0.99</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-tertiary text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="font-semibold">5,000 Coins</p>
          <p className="text-sm text-muted">$4.99</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-tertiary text-center">
          <div className="text-2xl mb-2">💎</div>
          <p className="font-semibold">10,000 Coins</p>
          <p className="text-sm text-muted">$9.99</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-tertiary text-center relative">
          <Badge className="absolute -top-2 -right-2 bg-primary border-primary text-white">Best Deal</Badge>
          <div className="text-2xl mb-2">🏆</div>
          <p className="font-semibold">25,000 Coins</p>
          <p className="text-sm text-muted">$19.99</p>
        </div>
      </div>
    </div>
  )
}

export default PackageSection;