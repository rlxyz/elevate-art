import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { truncate } from '@utils/format'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'

const LayerGridView = ({ traitElements, layerName }: { traitElements: TraitElement[] | undefined; layerName: string }) => {
  const router: NextRouter = useRouter()
  const cld = createCloudinary()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [show, setShow] = useState<number | null>(null)
  const [canEdit, setCanEdit] = useState(-1)
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const resetCanEdit = () => setCanEdit(-1)

  const mutation = trpc.useMutation('trait.setNameById', {
    onSuccess: (data, variables) => {
      // ctx.setQueryData(['layer.getLayerById', { id: variables.layerId }], data.changedLayer)
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], data.layers)
      resetCanEdit()
      notifySuccess(`Successfully updated to ${variables.newName} from ${variables.oldName}`)
    },
    onError: () => {
      resetCanEdit()
      notifyError('Sorry, we couldnt set the name')
    },
  })

  return (
    <div className='grid grid-cols-6 gap-x-3 gap-y-2'>
      {!traitElements?.length ? (
        // <LayerGridLoading />
        <></>
      ) : (
        traitElements?.map((trait: TraitElement, index: number) => {
          return (
            <div key={index} className='flex flex-col space-y-1'>
              <div className='cursor-pointer relative col-span-1'>
                <div className='pb-[100%] border border-mediumGrey rounded-[5px]' />
                <Image
                  layout='fill'
                  className='border border-mediumGrey rounded-[5px]'
                  src={cld
                    .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${trait.layerElementId}/${trait.id}.png`)
                    .toURL()}
                />
              </div>
              <span className='flex flex-col text-xs pb-1 items-center justify-center overflow-hidden whitespace-nowrap text-ellipsis'>
                {truncate(trait.name)}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default LayerGridView
