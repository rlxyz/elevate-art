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
  const { mutate: createManyTrait, isLoading } = trpc.useMutation('traits.create')
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

    // step 1: get traits being uploaded
    const traits = getTraitUploadObjectUrls(layer.name, files)
    setUploadedFiles(traits)
    const names = traits[layer.name]?.map((x) => x.name)
    if (!names) {
      setUploadState('error')
      notifyError('We couldnt find the layer. Please refresh the page to try again.')
      return
    }

    const allNewTraits = names
      .filter((x) => !layer.traitElements.map((x) => x.name).includes(x))
      .map((x) => ({
        name: x,
        layerElementId: layer.id,
        repositoryId: repositoryId,
      }))

    createManyTrait(
      { traitElements: allNewTraits },
      {
        onSuccess: async (data, variable) => {
          notifySuccess(`Saved ${variable.traitElements.length} traits. We are now uploading the images to the cloud...`)

          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

          // Snapshot the previous value
          const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
          if (!backup) return { backup }

          // Optimistically update to the new value
          const next = produce(backup, (draft) => {
            Object.entries(data).map(([layerElementId, traitElements]) => {
              const layer = draft.find((l) => l.id === layerElementId)
              if (!layer) return
              layer.traitElements = traitElements.map((x) => ({ ...x, rulesPrimary: [], rulesSecondary: [] }))
            })
          })

          ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
          const allTraits = Object.entries(data).flatMap((x) => x[1])
          files.map((file: FileWithPath) => {
            const reader = new FileReader()
            const traitName = file.path?.replace('.png', '') || ''
            if (!traitName) return
            reader.onload = async () => {
              const traitElement = allTraits.find((x) => x.name === traitName)
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
        onError: async (error, variables, context) => {
          if (JSON.parse(error.message).code === 'too_small') {
            notifyError("We couldn't find any new traits.")
          } else {
            notifyError('Something went wrong')
          }
        },
      }
    )
  }
  return { mutate, isLoading }
}
