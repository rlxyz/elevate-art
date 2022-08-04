import { useMintPeriod } from '@Hooks/contractsRead'
import { formatTime, useCountDown } from '@Hooks/useCountDown'
import dayjs from 'dayjs'

export const PresaleCountdown = () => {
  const { presaleTime } = useMintPeriod()
  const presaleCountDown = useCountDown(dayjs.unix(presaleTime).toDate())

  const timer = `${formatTime(presaleCountDown[1])}:${formatTime(
    presaleCountDown[2],
  )}:${formatTime(presaleCountDown[3])}`

  return (
    <div className="flex justify-between">
      <span>Presale Countdown</span>
      <span>{timer}</span>
    </div>
  )
}
