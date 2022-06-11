import { ConnectButton } from '@components/ConnectButton'

export const Disconnected = () => {
  return (
    <div className="mt-10 py-32 2xl:py-24 3xl:py-40 4xl:py-52 border border-gray rounded-lg">
      <ConnectButton normalButton />
    </div>
  )
}
