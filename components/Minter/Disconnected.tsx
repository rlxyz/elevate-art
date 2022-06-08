import { ConnectButton } from '@components/ConnectButton'

export const Disconnected = () => {
  return (
    <div className="mt-10 p-24 lg:py-32 lg:px-24 3xl:p-64 border border-gray rounded-lg">
      <ConnectButton normalButton />
    </div>
  )
}
