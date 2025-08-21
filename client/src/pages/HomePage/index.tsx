import { initDataUser } from "@telegram-apps/sdk-react";
import Page from "@/components/Page";
import ProfileSection from "./ProfileSection";
import MainSection from "./MainSection";
import ProgressSection from "./ProgressSection";
import ArchievementSection from "./ArchievementSection";
import OtherSection from "./OtherSection";
import TipSection from "./TipSection";

const HomePage = () => {
  const tg = initDataUser()!;

  return (
    <Page className="bg-gradient-to-br from-[#f67e55] to-primary">
      <div className="absolute inset-x-0 top-0 bg-[url('/imgs/background.jpg')] bg-center bg-cover text-center text-white pt-8 py-16">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <div className="text-2xl font-bold">🦁 Big Five Match</div>
          <div className="">Welcome back, {tg.first_name}!</div>
        </div>
      </div>

      <div className="relative pt-24 space-y-4">
        <ProfileSection />
        <MainSection />
        <ProgressSection />
        <ArchievementSection />
        <OtherSection />
        <TipSection />
      </div>
    </Page>
  );
};

export default HomePage;