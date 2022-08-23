import React from 'react'

interface PageContainerProps {
  header?: React.ReactNode
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export const PageContainer: React.FC<PageContainerProps> = ({
  header,
  leftContent,
  rightContent,
}) => {
  return (
    <>
      {header}
      <div className="px-5 lg:px-16 2xl:px-32 py-12 pb-20 grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>{leftContent}</div>
        <div className="ml-5">{rightContent}</div>
      </div>
    </>
  )
}
