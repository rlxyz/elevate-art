import dayjs from 'dayjs'
import { useMintPeriod, useTotalMinted } from 'src/client/hooks/contractsRead'
import { formatTime, useCountDown } from 'src/client/hooks/useCountDown'
import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'

export const PublicSaleCountdown = () => {
  const totalMinted = useTotalMinted()
  const { data } = useGetProjectDetail('rlxyz')
  const { publicTime } = useMintPeriod()
  const countdown = useCountDown(dayjs.unix(publicTime).toDate())

  const timer = `${formatTime(countdown[1])}:${formatTime(countdown[2])}:${formatTime(countdown[3])}`

  return (
    <div className='flex justify-between'>
      <span>{`Presale (${totalMinted}/${data?.totalSupply} Minted)`}</span>
      <span>{timer}</span>
    </div>
  )
}
