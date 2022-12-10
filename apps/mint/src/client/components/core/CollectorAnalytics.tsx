import AvatarComponent from '@Components/layout/avatar/Avatar'
import Card from '@Components/layout/card'
import LinkComponent from '@Components/layout/link/Link'
import type { RepositoryContractDeployment } from '@prisma/client'
import { ethers } from 'ethers'
import { buildEtherscanLink } from './Unused'

export const CollectorAnalytics = ({ contractDeployment }: { contractDeployment: RepositoryContractDeployment }) => (
  <Card>
    <h2 className='text-xs font-bold'>Collectors</h2>
    <div className='grid grid-cols-2 gap-3'>
      {[
        { address: '0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608', total: 23 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 8 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 5 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 3 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
      ]
        .filter((x) => ethers.utils.isAddress(x.address))
        .sort((a, b) => b.total - a.total)
        .splice(0, 6)
        .map(({ address, total }) => (
          <article key={address} className='flex flex-row items-center space-x-3 border border-mediumGrey rounded-[5px] p-2 shadow-lg'>
            <AvatarComponent />
            <div className='flex justify-between w-full'>
              <LinkComponent
                href={buildEtherscanLink({
                  address,
                  chainId: contractDeployment.chainId,
                })}
                underline
                rel='noreferrer nofollow'
                target='_blank'
              >
                <span className='text-[0.65rem]'>
                  {address.slice(0, 6)}....{address.slice(address.length - 4)}
                </span>
              </LinkComponent>
              <p className='text-xs font-semibold'>{total}</p>
            </div>
          </article>
        ))}
    </div>
  </Card>
)
