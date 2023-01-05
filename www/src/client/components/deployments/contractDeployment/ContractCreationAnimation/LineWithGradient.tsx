import clsx from 'clsx'

export const LineWithGradient: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('h-[1px] flex-1 bg-gradient-to-r from-mediumGrey via-blueHighlight to-mediumGrey z-1', className)} />
)
