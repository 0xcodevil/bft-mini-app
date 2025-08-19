const HelpSection = () => {
  return (
    <div className="border border-black/15 rounded-xl p-4 flex gap-2">
      <div className="text-xl">🤝</div>
      <div className="space-y-2">
        <div className="font-semibold">Friends Benefits</div>
        <ul className="text-sm text-black/70 space-y-1 list-disc">
          <li>Send and receive daily energy</li>
          <li>Compete in weekly challenges</li>
          <li>Share power-ups and bonuses</li>
          <li>Climb the leaderboard together</li>
        </ul>
      </div>
    </div>
  )
}

export default HelpSection;