import clsx from 'clsx'
import React from 'react'

export const RingOuterWithShadow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={clsx('flex drop-shadow-md p-1 box-border bg-lightGray rounded-full', className)} aria-hidden='true'>
    {children}
  </div>
)
