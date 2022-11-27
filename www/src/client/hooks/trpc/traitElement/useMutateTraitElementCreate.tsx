import { UploadState } from '@components/layout/upload/upload'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { createCloudinaryFormData, getTraitUploadObjectUrls } from 'src/client/utils/cloudinary'
import { trpc } from 'src/client/utils/trpc'
import { env } from 'src/env/client.mjs'

export const useMutateTraitElementCreate = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutateAsync: createManyTrait, isLoading } = trpc.traitElement.create.useMutation()
  const { current: layer } = useQueryLayerElementFindAll()
  const { notifyError, notifySuccess } = useNotification()

  const mutate = async ({
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
    setUploadState: (state: UploadState) => void
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

    try {
      const response = await createManyTrait({ traitElements: allNewTraits })
      await ctx.layerElement.findAll.cancel({ repositoryId })
      const allTraits = Object.entries(response).flatMap((x) => x[1])
      setUploadState('uploading')
      const filePromises = files.map((file: FileWithPath) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          const name = file.path?.replace('.png', '') || ''
          const traitElement = allTraits.find((x) => x.name === name)
          if (!traitElement) return
          reader.onload = async () => {
            try {
              const response = await fetch(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'post',
                body: createCloudinaryFormData(file, traitElement, repositoryId),
              })
              const data = await response.json()
              const { secure_url } = data as { secure_url: string }
              setUploadedFiles((state) =>
                produce(state, (draft) => {
                  const trait = draft[layer.name]?.find((x) => x.name === name)
                  if (!trait) return
                  trait.uploaded = true
                })
              )
              resolve({ traitElementId: traitElement.id, imageUrl: secure_url })
            } catch (err) {
              reject(err)
            }
          }
          reader.onerror = (err) => reject(err)
          reader.readAsBinaryString(file)
        })
      })
      await Promise.all(filePromises).then((data) => {
        notifySuccess('Trait elements created successfully')
        const backup = ctx.layerElement.findAll.getData({ repositoryId })
        if (!backup) return
        const next = produce(backup, (draft) => {
          Object.entries(response).map(([layerElementId, traitElements]) => {
            const layer = draft.find((l) => l.id === layerElementId)
            if (!layer) return
            layer.traitElements = traitElements.map((x) => ({ ...x, rulesPrimary: [], rulesSecondary: [] }))
          })
        })
        ctx.layerElement.findAll.setData({ repositoryId }, next)
        setUploadState('done')
        notifySuccess('Uploaded....')
      })
      return
    } catch (err) {
      setUploadState('error')
      notifyError('Something went wrong. Please refresh the page to try again.')
      return
    }
  }
  return { mutate, isLoading }
}
