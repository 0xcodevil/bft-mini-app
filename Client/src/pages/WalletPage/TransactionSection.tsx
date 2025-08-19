import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TransactionSection = () => {
  const transactions: any[] = [
    // { id: 1, type: "earned", amount: 500, description: "Daily Check-in Reward", date: "2024-01-15", status: "completed" },
    // { id: 2, type: "spent", amount: 200, description: "Lion Power-up Purchase", date: "2024-01-14", status: "completed" },
    // { id: 3, type: "earned", amount: 1000, description: "Weekly Challenge Reward", date: "2024-01-13", status: "completed" },
    // { id: 4, type: "earned", amount: 300, description: "Friend Invitation Bonus", date: "2024-01-12", status: "completed" },
    // { id: 5, type: "spent", amount: 150, description: "Extra Moves Purchase", date: "2024-01-11", status: "completed" },
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-black/5">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${tx.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {tx.type === 'earned' ? <LuArrowDownLeft size={16} /> : <LuArrowUpRight size={16} />}
              </div>

              <div>
                <p className="font-medium text-sm">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-semibold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'earned' ? '+' : '-'}{tx.amount}
              </p>
              <Badge>{tx.status}</Badge>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <div className="flex justify-center items-center p-3 rounded-lg bg-black/5">
          No History
        </div>}
      </div>
    </Card>
  )
}

export default TransactionSection;