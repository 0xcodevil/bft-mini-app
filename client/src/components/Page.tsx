import { type PropsWithChildren } from 'react';

const Page = ({ children, className = "" }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean,
  className?: string,
}>) => {

  return (
    <div className={`min-h-screen pt-5 pb-20 ${className}`}>
      <div className="px-4 max-w-md mx-auto space-y-4">
        {children}
      </div>
    </div>
  )
}

export default Page;