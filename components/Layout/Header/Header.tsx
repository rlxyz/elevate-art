import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between min-h-12 p-8 2xl:p-8 pointer-events-auto border-b border-b-gray">
      <h1 className="text-sm lg:text-xl">
        <span className="text-[#9C9C9C] font-medium">Powered by</span>{' '}
        <span className="font-gilroy-extra-bold line-through">RLXYZ</span>
      </h1>
      <div className="ml-4 md:block flex justify-center space-x-6 md:order-2">
        <ConnectButton accountStatus="address" showBalance={false} />
      </div>
    </header>
  )
}
