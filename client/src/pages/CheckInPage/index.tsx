import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Page from "@/components/Page";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LuCalendar, LuGift, LuStar, LuCoins } from "react-icons/lu";
import { API, apiErrorHandler } from "@/libs/API";

const CheckInPage = () => {
  const [claimable, setClaimable] = useState(false);
  const [streak, setStreak] = useState(7);
  const [rewards, setRewards] = useState<any[]>([]);

  const refresh = () => {
    API.get('/check-in/check').then(res => {
      setStreak(res.data.streak);
      setRewards(res.data.rewards);
      setClaimable(res.data.claimable);
    }).catch(console.error);
  };

  const handleCheckIn = () => {
    API.post('/check-in/claim').then(() => {
      toast.success('Claimed successfully.');
      refresh();
    }).catch(apiErrorHandler);
  };

  useEffect(refresh, []);

  return (
    <Page className="bg-gradient-to-b from-[#75c7f0] to-[#dbba57]">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Daily Check-in</h1>
        <p className="text-sm text-black/80">
          Visit the savanna every day for amazing rewards!
        </p>
      </div>

      <div className="p-6 rounded-xl bg-primary border border-white text-center text-white">
        <LuCalendar size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold">{streak + 1} Day Streak! 🔥</h2>
        <p className="text-lg opacity-90">Keep it up, Safari Explorer!</p>
      </div>

      <Card>
        <h3 className="font-semibold mb-4 flex items-center">
          <LuGift className="mr-2 text-primary" size={20} />
          Weekly Rewards
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {rewards.map((reward, key) => {

            return (
              <div
                key={key}
                onClick={key === streak && claimable ? handleCheckIn : () => {}}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${key < streak
                  ? "bg-black/10 border-muted/50"
                  : key === streak && claimable
                    ? "bg-primary/10 border-primary border-dashed animate-pulse cursor-pointer"
                    : "bg-card border-border"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <p className="font-semibold">Day {key + 1}</p>
                    <p className="text-sm text-muted">{reward.coin} Coin{reward.coin > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div>
                  {key < streak ? (
                    <Badge className="bg-secondary border-secondary text-white">Claimed ✓</Badge>
                  ) : key === streak && claimable ? (
                    <Badge className="bg-primary border-primary text-white">Today!</Badge>
                  ) : (
                    <Badge>Locked</Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {claimable && (
        <button
          onClick={handleCheckIn}
          className="w-full flex items-center justify-center py-2 rounded-xl text-white text-lg font-semibold bg-primary cursor-pointer hover:opacity-90 transition-opacity"
        >
          <LuCoins className="mr-2" size={24} />
          Claim Today's Reward
        </button>
      )}

      {!claimable && (
        <Card className="p-6 text-center bg-secondary/20">
          <LuStar size={48} className="mx-auto mb-4 text-safari-lion" />
          <h3 className="text-xl font-bold mb-2 text-secondary">
            Reward Claimed! 🎉
          </h3>
          <p className="text-muted-foreground">
            Come back tomorrow for your next reward!
          </p>
        </Card>
      )}

      {/* Bonus Info */}
      <Card>
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold mb-2">Pro Tip</h4>
            <p className="text-sm text-muted">
              Complete your daily check-in for 30 days straight to unlock the
              <span className="font-semibold text-primary"> Legendary Safari Master</span> badge!
            </p>
          </div>
        </div>
      </Card>
    </Page>
  );
};

export default CheckInPage;