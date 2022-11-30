import { UploadState } from '@components/layout/upload/upload'
import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import { createCloudinaryFormData, parseLayerElementFolder } from 'src/client/utils/cloudinary'
import { trpc } from 'src/client/utils/trpc'
import { env } from 'src/env/client.mjs'
import { useMutationContext } from '../useMutationContext'

export const useMutateTraitElementCreate = ({ layerElementId }: { layerElementId: string | undefined }) => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  const { mutateAsync: createManyTrait, isLoading } = trpc.traitElement.create.useMutation()

  const mutate = async ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>
    setUploadState: (state: UploadState) => void
  }) => {
    // step 0: validate layer
    const layerElements = ctx.layerElement.findAll.getData({ repositoryId })
    const layerElement = layerElements?.find((x) => x.id === layerElementId)

    if (!layerElement) {
      setUploadState('error')
      notifyError('Something went wrong with the upload. Please refresh the page to try again.')
      return
    }

    // step 1: get traits being uploaded
    const traitElements = parseLayerElementFolder(layerElement.name, files)
    const names = traitElements[layerElement.name]?.map((x) => x.name)
    if (!names) {
      setUploadState('error')
      notifyError('Something went wrong with the upload. Please refresh the page to try again.')
      return
    }

    const allExistingTraitElements = layerElement.traitElements.map((x) => x.name)
    setUploadedFiles(traitElements)
    setUploadedFiles((old) => {
      return produce(old, (draft) => {
        names.forEach((name) => {
          Object.entries(draft).find(([key, value]) => {
            const trait = value.find((x) => x.name === name)
            if (!trait) return

            if (allExistingTraitElements.includes(name)) {
              if (trait.name.toLocaleLowerCase() === 'none') {
                trait.type = 'invalid'
              } else {
                trait.type = 'existing'
              }
            } else {
              trait.type = 'new'
            }
          })
        })
      })
    })

    try {
      /** Create new traits, if any */
      const newTraitElements = names
        .filter((x) => !layerElement.traitElements.map((x) => x.name).includes(x))
        .map((x) => ({
          name: x,
          layerElementId: layerElement.id,
          repositoryId: repositoryId,
        }))
      const response = await createManyTrait({ traitElements: newTraitElements })
      await ctx.layerElement.findAll.cancel({ repositoryId })
      const allTraits = [...Object.entries(response).flatMap((x) => x[1]), ...layerElement.traitElements].map((x) => x.id)
      // const set = new Set(allTraits)

      setUploadState('uploading')
      // ...Object.entries(response).flatMap((x) => x[1]), ...layerElement.traitElements
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
                  const trait = draft[layerElement.name]?.find((x) => x.name === name)
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
