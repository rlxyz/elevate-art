import clsx from 'clsx'
import { formatTime, useSaleCountDown } from './useSaleCountDown'

export const SaleLayoutHeader = ({
  title,
  startingDate,
  className,
}: {
  title: string
  startingDate?: { label: string; value?: Date }
  className?: string
}) => {
  const { days, hours, minutes, seconds } = useSaleCountDown({ target: startingDate?.value })
  const timer = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
  return (
    <div className={clsx(className, 'flex justify-between')}>
      <h1 className='text-xs font-semibold'>{title}</h1>
      {startingDate && (
        <div className='flex justify-between items-center space-x-2 text-xs'>
          <span>{startingDate.label ?? 'Countdown'}</span>
          {startingDate.value ? (
            <>
              <div className='w-0.5 h-0.5 bg-darkGrey rounded-full'>
                <p className='font-semibold w-20'>{timer}</p>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}
