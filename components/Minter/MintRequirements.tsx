import { ControlTextbox } from '@components/UI/ControlTextbox'

export const MintRequirements = () => {
  return (
    <div className="mt-10">
      <h2 className="text-lg">Requirements</h2>
      <div className="flex flex-col border border-gray rounded-lg mt-4">
        <div className="flex items-center px-4 py-6 border-b border-b-gray">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <span>You are on the Allowlist</span>
        </div>
        <div className="flex items-center px-4 py-6 border-b border-b-gray">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <span>This collection has minted 420/5555 NFTs</span>
        </div>
        <div className="flex items-center px-4 py-6 border-b border-b-gray">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <span>Time remaining in Presale</span>
        </div>
        <div className="flex items-center px-4 py-6 border-b border-b-gray">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <span>You are eligible for 10 mints</span>
        </div>
        <div className="flex items-center p-4">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <ControlTextbox />
        </div>
      </div>
    </div>
  )
}
