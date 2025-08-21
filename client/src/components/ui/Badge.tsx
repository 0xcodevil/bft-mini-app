import { PropsWithChildren } from "react";

const Badge = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`w-fit border border-[#d6cec2] px-2 py-0.5 rounded-full font-semibold text-xs ${className}`}>
      {children}
    </div>
  )
}

export default Badge;