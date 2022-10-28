import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { getTraitUploadObjectUrls, uploadCollectionLayerImageCloudinary } from '@utils/cloudinary'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'

export const useMutateCreateTrait = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate: createManyTrait } = trpc.useMutation('traits.createMany')
  const { current: layer } = useQueryRepositoryLayer()
  const { notifyError, notifySuccess } = useNotification()
  const mutate = ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<
      SetStateAction<{
        [key: string]: {
          name: string
          imageUrl: string
          size: number
          uploaded: boolean
        }[]
      }>
    >
    setUploadState: (state: 'idle' | 'uploading' | 'done' | 'error') => void
  }) => {
    // step 0: validate layer
    if (!layer) {
      setUploadState('error')
      notifyError('We couldnt find the layer. Please refresh the page to try again.')
      return
    }

    const traits = getTraitUploadObjectUrls(layer.name, files)
    setUploadedFiles(traits)
    const names = traits[layer.name]?.map((x) => x.name)
    if (!names) {
      setUploadState('error')
      notifyError('We couldnt find the layer. Please refresh the page to try again.')
      return
    }
    const allExistingTraits = layer.traitElements.map((x) => x.name)

    createManyTrait(
      {
        layerElementId: layer.id,
        traitElements: names.filter((x) => !allExistingTraits.includes(x)),
      },
      {
        onSuccess: async (data, variables) => {
          notifySuccess('We are now uploading the images to the cloud...')

          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])

          // Snapshot the previous value
          const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
          if (!backup) return { backup }

          // Optimistically update to the new value
          const next = produce(backup, (draft) => {
            const layer = draft.find((l) => l.id === variables.layerElementId)
            if (!layer) return
            layer.traitElements = data
          })

          ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)

          files.map((file: FileWithPath) => {
            const reader = new FileReader()
            const traitName = file.path?.replace('.png', '') || ''
            if (!traitName) return
            reader.onload = async () => {
              const traitElement = data.find((x) => x.name === traitName)
              if (!traitElement) return
              uploadCollectionLayerImageCloudinary({
                file,
                traitElement,
                repositoryId,
              }).then(() => {
                setUploadedFiles((state) =>
                  produce(state, (draft) => {
                    const trait = draft[layer.name]?.find((x) => x.name === traitName)
                    if (!trait) return
                    trait.uploaded = true
                  })
                )
              })
            }
            reader.readAsArrayBuffer(file)
          })
        },
      }
    )
  }
  return { mutate }
}
