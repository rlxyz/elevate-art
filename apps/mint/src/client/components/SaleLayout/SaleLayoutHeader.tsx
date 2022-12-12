import clsx from 'clsx'
import { formatTime, useCountDown } from 'src/client/hooks/useCountDown'

export const SaleLayoutHeader = ({
  title,
  endingDate,
  className,
}: {
  title: string
  endingDate?: { label: string; value: Date }
  className?: string
}) => {
  const { days, hours, minutes, seconds } = useCountDown({ target: endingDate?.value })
  const timer = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
  return (
    <div className={clsx(className, 'flex justify-between')}>
      <h1 className='text-xs font-semibold'>{title}</h1>
      {endingDate && (
        <div className='flex justify-between items-center space-x-2 text-xs'>
          <span>{endingDate.label ?? 'Countdown'}</span>
          <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
          <p className='font-semibold w-20'>{timer}</p>
        </div>
      )}
    </div>
  )
}
