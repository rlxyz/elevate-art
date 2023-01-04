import SettingLayout from '@components/layout/settings'
import type { ContractDeployment, Whitelist, WhitelistType } from '@prisma/client'
import { parseChainId } from '@utils/ethers'
import { capitalize, toPascalCaseWithSpace } from 'src/client/utils/format'

export const AllowlistLayoutHeader = ({
  contractDeployment,
  whitelist,
  dbMerkleRoot,
  contractMerkleRoot,
  type,
  write,
}: {
  contractDeployment: ContractDeployment
  whitelist: Whitelist[]
  write: () => void
  dbMerkleRoot: string
  type: WhitelistType
  contractMerkleRoot: string
}) => {
  return (
    <SettingLayout
      onSubmit={(e) => {
        e.preventDefault()
        write()
      }}
      disabled={contractMerkleRoot === dbMerkleRoot && whitelist.length === 0}
    >
      <SettingLayout.Header title='Information' description="Here's some important information about your whitelist" />
      <SettingLayout.Body>
        <div className='text-xs space-y-2'>
          {contractMerkleRoot !== dbMerkleRoot ? (
            <span>
              Your <strong>{toPascalCaseWithSpace(type)}</strong> is out of sync. You need to update the contract on{' '}
              <strong>{capitalize(parseChainId(contractDeployment?.chainId || 99))}</strong> to sync up your allowlist.
            </span>
          ) : whitelist.length === 0 ? (
            <span>You do not have any items in your allowlist</span>
          ) : (
            <span>
              Your <strong>{toPascalCaseWithSpace(type)}</strong> merkle root is in sync with the contract on{' '}
              <strong>{capitalize(parseChainId(contractDeployment?.chainId || 99))}</strong>
            </span>
          )}
          <span className='flex-col'>
            <div>
              <strong>Merkle Root in Contract</strong> {contractMerkleRoot}
            </div>
            <div>
              <strong>Merkle Root in Db</strong> {dbMerkleRoot}
            </div>
          </span>
        </div>
      </SettingLayout.Body>
    </SettingLayout>
  )
}
