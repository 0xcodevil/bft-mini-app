import { PropsWithChildren } from "react";

const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`bg-white rounded-xl p-4 border border-border ${className}`}>
      {children}
    </div>
  )
}

export default Card;