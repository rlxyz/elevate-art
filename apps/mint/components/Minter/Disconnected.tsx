import { ConnectButton } from '@Components/ConnectButton'

export const Disconnected = () => {
  return (
    <div className="mt-10 py-32 2xl:py-24 3xl:py-40 4xl:py-52 border border-lightGray rounded-lg">
      <ConnectButton normalButton />
    </div>
  )
}
