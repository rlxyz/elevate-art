import { formatTime, useCountDown } from 'src/client/hooks/useCountDown'

export const SaleLayoutHeader = ({ title, endingDate }: { title: string; endingDate?: Date }) => {
  const { days, hours, minutes, seconds } = useCountDown({ target: endingDate })
  const timer = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
  return (
    <div className='flex justify-between'>
      <h1 className='text-xs font-semibold'>{title}</h1>
      {endingDate && (
        <div className='flex justify-between items-center space-x-2 text-xs'>
          <span>Countdown</span>
          <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
          <p className='font-semibold'>{timer}</p>
        </div>
      )}
    </div>
  )
}
