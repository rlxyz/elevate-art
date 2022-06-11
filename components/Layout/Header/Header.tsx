import { ConnectButton } from '@components/ConnectButton'

export const Header = () => {
  return (
    <header className="w-full flex justify-between h-[7rem] px-4 lg:py-8 lg:px-8 pointer-events-auto border-b border-b-gray">
      <h1 className="lg:text-xl">
        <span className="text-[#9C9C9C] font-medium">Powered by</span>{' '}
        <span className="font-gilroy-extra-bold line-through">RLXYZ</span>
      </h1>
      <div className="ml-4 md:block flex justify-center space-x-6 md:order-2">
        <ConnectButton />
      </div>
    </header>
  )
}
