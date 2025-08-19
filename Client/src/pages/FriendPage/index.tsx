import Page from "@/components/Page";
import InviteSection from "./InviteSection";
import RewardSection from "./RewardSection";
import FriendSection from "./FriendSection";
import HelpSection from "./HelpSection";

const FriendPage = () => {
  return (
    <Page className="bg-gradient-to-b from-[#78543a] to-[#88b34d]">
      <div className="text-center space-y-2">
        <h1 className="text-white text-2xl font-bold">Safari Friends</h1>
        <p className="text-sm text-white/50">Explore the savanna together and earn rewards!</p>
      </div>
      <InviteSection />
      <RewardSection />
      <FriendSection />
      <HelpSection />
    </Page>
  )
}

export default FriendPage;