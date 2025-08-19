const Progress = ({ value }: { value: number }) => {
  return (
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <div className="bg-primary h-full transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

export default Progress;