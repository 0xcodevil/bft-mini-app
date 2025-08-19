const TipSection = () => {
  return (
    <div className="border border-[#dbba57] bg-[#dbba571a] rounded-xl p-4 flex gap-2">
      <div className="text-xl">💡</div>
      <div className="">
        <div className="font-semibold">Tip of today</div>
        <div className="text-sm text-black/70 text-justify">Match 5 animals in a row to unlock the powerful Lion's Roar ability that clears an entire row!</div>
      </div>
    </div>
  )
}

export default TipSection;