import { initDataUser, openTelegramLink } from "@telegram-apps/sdk-react";
import { LuUsers } from "react-icons/lu";
import { toast } from "react-toastify";

const InviteSection = () => {
  const user = initDataUser()!;

  const handleInviteLink = () => {
    const shareText = '\nJoin $BFT app and explore savanna together! 🐆'
    const link = import.meta.env.VITE_APP_URL + '?startapp=' + user.id;
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
    openTelegramLink(inviteLink);
  }

  const handleCopyLink = () => {
    const link = import.meta.env.VITE_APP_URL + '?startapp=' + user.id;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Invite link copied.');
    }).catch(err => {
      console.error(err);
      toast.error(err.message);
    });
  }

  return (
    <div className="rounded-xl p-4 bg-primary border border-white text-white space-y-4">
      <div className="flex flex-col items-center">
        <LuUsers size={32} />
        <div className="text-xl font-bold">Invite Friends</div>
        <div className="">Get 10 coins for each friend who joins!</div>
      </div>
      <div onClick={handleCopyLink} className="bg-white/30 rounded-xl p-4 text-center space-y-2 cursor-pointer">
        <div className="text-sm text-white">Your Invite Link:</div>
        <div className="font-bold text-lg">{import.meta.env.VITE_APP_URL + '?startapp=' + user.id}</div>
      </div>
      <button onClick={handleInviteLink} className="cursor-pointer w-full bg-white hover:bg-white/90 rounded-xl flex items-center justify-center gap-4 p-2 text-primary transition-all duration-200">
        <LuUsers />
        <span className="text-sm font-semibold">Invite Friend</span>
      </button>
    </div>
  )
}

export default InviteSection;