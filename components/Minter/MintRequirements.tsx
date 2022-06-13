import { PresaleRequirements, PublicSaleRequirements } from '@components/MintRequirements'
import { ControlTextbox } from '@components/UI/ControlTextbox'
import { useMintPeriod } from '@hooks/contractsRead'

export const MintRequirements = () => {
  const { mintPhase } = useMintPeriod()

  if (mintPhase === 'none' || mintPhase === 'presale') {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-bold">Presale Requirements</h2>
        <div className="flex flex-col border border-gray rounded-lg mt-4">
          <PresaleRequirements />
          <div className="flex items-center p-4">
            <img src="/images/check.svg" className="mr-6" alt="Check" />
            <ControlTextbox />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold">Public Sale Requirements</h2>
      <div className="flex flex-col border border-gray rounded-lg mt-4">
        <PublicSaleRequirements />
        <div className="flex items-center p-4">
          <img src="/images/check.svg" className="mr-6" alt="Check" />
          <ControlTextbox />
        </div>
      </div>
    </div>
  )
}
