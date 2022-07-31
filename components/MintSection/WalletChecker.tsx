import { RightContentContainer } from '@Components/Layout/RightContentContainer'
import { Button } from '@Components/UI/Button'
import { Textbox } from '@Components/UI/Textbox'
import { useMintPeriod } from '@Hooks/contractsRead'
import { formatTime, useCountDown } from '@Hooks/useCountDown'
import dayjs from 'dayjs'

export const WalletChecker = () => {
  const { presaleTime } = useMintPeriod()
  const presaleCountDown = useCountDown(dayjs.unix(presaleTime).toDate())

  const timer = `${formatTime(presaleCountDown[1])}:${formatTime(
    presaleCountDown[2],
  )}:${formatTime(presaleCountDown[3])}`

  return (
    <RightContentContainer
      firstHeading={
        <div className="flex justify-between">
          <span>Presale Countdown</span>
          <span>{timer}</span>
        </div>
      }
      secondHeading={
        <>
          <span>
            Check if your Wallet Address is on the <strong>Allow List</strong>
          </span>
        </>
      }
    >
      <div className="flex mt-2 mb-8">
        <div className="mr-5 w-full">
          <Textbox id="walletAddress" name="walletAddress" placeholder="0x25...94cE" />
        </div>
        <div>
          <Button label="Check" />
        </div>
      </div>
      <hr className="border-lightGray" />
      <div className="mt-8 mb-5">
        <span>This wallet address is on the list</span>
      </div>
    </RightContentContainer>
  )
}
