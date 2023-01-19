import AvatarComponent from '@components/layout/avatar/Avatar'
import { ArrowTopRightIcon } from '@components/layout/icons/ArrowTopRightIcon'
import NextLinkComponent from '@components/layout/link/NextLink'
import Menu from '@components/layout/menu'
import { CubeIcon, LinkIcon, TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/utils/useNotification'
import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { AssetDeploymentBranch, AssetDeploymentStatus } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import { formatEthereumHash } from '@utils/ethers'
import clsx from 'clsx'
import { useState } from 'react'
import { routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'
import { timeAgo } from 'src/client/utils/time'
import { env } from 'src/env/client.mjs'
import RepositoryDeploymentDeleteModal from './RepositoryDeploymentDeleteModal'
import RepositoryDeploymentPromoteModal from './RepositoryDeploymentPromoteModal'

export const RepositoryDeploymentPreviewCard = ({
  deployment,
  organisationName,
  repositoryName,
}: {
  deployment: AssetDeployment & {
    contractDeployment: ContractDeployment | null
    creator: {
      address: string
    } | null
  }
  organisationName: string
  repositoryName: string
}) => {
  const { notifyInfo } = useNotification()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${deployment.name}/0`) // @todo fix
    notifyInfo('Copied to clipboard')
  }

  return (
    <div key={deployment.id} className='grid grid-cols-4'>
      <div className='text-xs flex flex-row items-center space-x-2'>
        <div>
          <div className='flex flex-col justify-center'>
            {deployment.status === AssetDeploymentStatus.DEPLOYED ? (
              <NextLinkComponent
                underline
                href={routeBuilder(organisationName, repositoryName, ZoneNavigationEnum.enum.Deployments, deployment.name)}
                className='font-semibold w-fit'
              >
                {deployment.name}
              </NextLinkComponent>
            ) : (
              <span>{deployment.name}</span>
            )}
          </div>
          <span>{deployment.slug}</span>
        </div>
        {deployment.contractDeployment && (
          <span className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 lg:text-xs text-[0.6rem] font-medium text-black'>
            <span className='text-darkGrey mr-1 text-[0.6rem]'>Deployed</span>
          </span>
        )}
      </div>
      <div>
        <span className='text-xs flex flex-col h-full space-x-2'>
          <div className='flex space-x-3'>
            <div
              className={clsx(
                'rounded-full w-4 h-4 border border-mediumGrey',
                deployment.status === AssetDeploymentStatus.FAILED && 'bg-redError',
                deployment.status === AssetDeploymentStatus.DEPLOYED && 'bg-blueHighlight',
                deployment.status === AssetDeploymentStatus.PENDING && 'bg-lightGray'
              )}
            />
            <div className='flex flex-col'>
              <span>
                {deployment.status === AssetDeploymentStatus.FAILED && 'Error'}
                {deployment.status === AssetDeploymentStatus.DEPLOYED && 'Ready'}
                {deployment.status === AssetDeploymentStatus.PENDING && 'Deploying'}
              </span>
              <span>{timeAgo(deployment.updatedAt)}</span>
            </div>
          </div>
        </span>
      </div>
      <div className='text-xs flex flex-col'>
        <span>
          Environment <strong>{toPascalCaseWithSpace(deployment.branch)}</strong>
        </span>
        <span>
          Mint Type <strong>{toPascalCaseWithSpace(deployment.type)}</strong>
        </span>
      </div>
      <div className='text-xs flex justify-end items-center space-x-2'>
        {deployment.creator && (
          <>
            <span>
              {timeAgo(deployment.createdAt)} by <strong>{formatEthereumHash(deployment.creator.address)}</strong>
            </span>
            <AvatarComponent src='/images/avatar-blank.png' />
          </>
        )}
        <div className='relative w-6'>
          <Menu vertical position='bottom-left'>
            <Menu.Items>
              <Menu.Item as='span'>
                <button
                  className={clsx('flex space-x-2 items-center h-full w-full', 'disabled:cursor-not-allowed disabled:opacity-40')}
                  onClick={() => setIsPromoteDialogOpen(true)}
                  disabled={
                    deployment.status !== AssetDeploymentStatus.DEPLOYED ||
                    deployment.branch === AssetDeploymentBranch.PRODUCTION ||
                    deployment.contractDeployment === null
                  }
                >
                  <CubeIcon className='w-3 h-3' />
                  <span>Promote to Production</span>
                </button>
              </Menu.Item>
              {/* <Menu.Item as='button' type='button'>
              <EyeIcon className='w-3 h-3' />
              <span>Enable Stealth Mode</span>
            </Menu.Item> */}
              <Menu.Item as='button' type='button' onClick={() => setIsDeleteDialogOpen(true)}>
                <TrashIcon className='w-3 h-3' />
                <span>Delete</span>
              </Menu.Item>
            </Menu.Items>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => onClipboardCopy()}>
                <LinkIcon className='w-3 h-3' />
                <span>Copy URL</span>
              </Menu.Item>
              <Menu.Item
                as={NextLinkComponent}
                href={`${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/${deployment.name}/0`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ArrowTopRightIcon className='w-3 h-3' />
                <span>Vist</span>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <RepositoryDeploymentDeleteModal visible={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} deployment={deployment} />
      <RepositoryDeploymentPromoteModal
        visible={isPromoteDialogOpen}
        onClose={() => setIsPromoteDialogOpen(false)}
        deployment={deployment}
      />
    </div>
  )
}
