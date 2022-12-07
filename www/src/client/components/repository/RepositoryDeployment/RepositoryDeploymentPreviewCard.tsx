import AvatarComponent from '@components/layout/avatar/Avatar'
import { ArrowTopRightIcon } from '@components/layout/icons/ArrowTopRightIcon'
import NextLinkComponent from '@components/layout/link/NextLink'
import Menu from '@components/layout/menu'
import RepositoryDeploymentDeleteModal from '@components/repository/RepositoryDeployment/RepositoryDeploymentDeleteModal'
import { CubeIcon, LinkIcon, TrashIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/utils/useNotification'
import { RepositoryDeployment, RepositoryDeploymentStatus } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import { toPascalCaseWithSpace } from 'src/client/utils/format'
import { timeAgo } from 'src/client/utils/time'
import { env } from 'src/env/client.mjs'
import RepositoryContractDeploymentCreateModal from './RepositoryContractDeploymentDeleteModal'

export const RepositoryDeploymentPreviewCard = ({
  deployment,
  organisationName,
  repositoryName,
}: {
  deployment: RepositoryDeployment
  organisationName: string
  repositoryName: string
}) => {
  const { notifyInfo } = useNotification()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateContractDeploymentDialogOpen, setIsCreateContractDeploymentDialogOpen] = useState(false)

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/${deployment.name}/0`)
    notifyInfo('Copied to clipboard')
  }

  return (
    <div key={deployment.id} className='p-4 grid grid-cols-4'>
      <div className='flex flex-col justify-center  text-xs'>
        {deployment.status === RepositoryDeploymentStatus.DEPLOYED ? (
          <NextLinkComponent
            rel='noreferrer nofollow'
            target='_blank'
            underline
            href={`${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/${deployment.name}/0`}
            className='font-semibold w-fit'
          >
            {deployment.name}
          </NextLinkComponent>
        ) : (
          <span>{deployment.name}</span>
        )}
        <span>{toPascalCaseWithSpace(deployment.type)}</span>
      </div>
      <div>
        <span className='text-xs flex flex-col h-full space-x-2'>
          <div className='flex space-x-3'>
            <div
              className={clsx(
                'rounded-full w-4 h-4 border border-mediumGrey',
                deployment.status === RepositoryDeploymentStatus.FAILED && 'bg-redError',
                deployment.status === RepositoryDeploymentStatus.DEPLOYED && 'bg-blueHighlight',
                deployment.status === RepositoryDeploymentStatus.PENDING && 'bg-lightGray'
              )}
            />
            <div className='flex flex-col'>
              <span>
                {deployment.status === RepositoryDeploymentStatus.FAILED && 'Error'}
                {deployment.status === RepositoryDeploymentStatus.DEPLOYED && 'Ready'}
                {deployment.status === RepositoryDeploymentStatus.PENDING && 'Deploying'}
              </span>
              <span>{timeAgo(deployment.updatedAt)}</span>
            </div>
          </div>
        </span>
      </div>
      <div className='text-xs flex flex-col'>
        <span>
          Total Supply <strong>{deployment.collectionTotalSupply}</strong>
        </span>
        <span>
          Generation <strong>{deployment.collectionGenerations}</strong>
        </span>
      </div>
      <div className='text-xs flex justify-end items-center space-x-2'>
        <span>
          {timeAgo(deployment.createdAt)} by <strong>Jeevan Pillay</strong>
        </span>
        <AvatarComponent src='/images/avatar-blank.png' />
        <div className='relative w-6'>
          <Menu vertical position='bottom-left'>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => setIsCreateContractDeploymentDialogOpen(true)}>
                <CubeIcon className='w-3 h-3' />
                <span>Deploy Contract</span>
              </Menu.Item>
              {/* <Menu.Item as='button' type='button'>
              <CubeIcon className='w-3 h-3' />
              <span>Promote to Production</span>
            </Menu.Item>
            <Menu.Item as='button' type='button'>
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
      <RepositoryContractDeploymentCreateModal
        visible={isCreateContractDeploymentDialogOpen}
        onClose={() => setIsCreateContractDeploymentDialogOpen(false)}
        deployment={deployment}
      />
    </div>
  )
}
