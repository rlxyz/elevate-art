import { UploadState } from '@components/layout/upload/upload'
import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import { createCloudinaryFormData } from 'src/client/utils/cloudinary'
import { trpc } from 'src/client/utils/trpc'
import { parseLayerElementFolder, ParseLayerElementFolderOutput } from 'src/client/utils/upload'
import { env } from 'src/env/client.mjs'
import { useQueryLayerElementFindAll } from '../layerElement/useQueryLayerElementFindAll'
import { useMutationContext } from '../useMutationContext'

export const useMutateTraitElementCreate = () => {
  const { current: layerElement } = useQueryLayerElementFindAll()
  const { repositoryId, ctx } = useMutationContext()
  const { mutateAsync: createManyByLayerElementId, isLoading } = trpc.traitElement.createManyByLayerElementId.useMutation()

  const mutate = async ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>
    setUploadState: (state: UploadState) => void
  }) => {
    if (!layerElement) {
      return setUploadState('error')
    }

    /**
     * Find all the files that are in the correct folder structure
     */
    const parsed: ParseLayerElementFolderOutput = parseLayerElementFolder({
      files,
      traitElements: layerElement.traitElements,
      layerElementName: layerElement.name,
    })

    /** Error handle */
    const traitElements = parsed[layerElement.name]
    if (!traitElements?.length) {
      return setUploadState('error')
    }

    /** Update UploadState */
    setUploadedFiles(parsed)
    setUploadState('uploading')

    /**
     * Create the TraitElements
     */
    const createTraitElements = traitElements
      .filter((x) => x.type === 'new')
      .map((x) => ({
        name: x.name,
      }))

    const response = await createManyByLayerElementId({
      layerElementId: layerElement.id,
      traitElements: createTraitElements,
    })

    /** Upload all to the Cloud */
    const filePromises = files.map((file: FileWithPath) => {
      return new Promise((resolve, reject) => {
        /** Find the TraitElement */
        const traitElement = response.find((x) => x.name === file.name.replace('.png', ''))
        if (!traitElement) return

        /** Create the reader */
        const reader = new FileReader()

        /** Load and upload */
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
                const trait = draft[layerElement.name]?.find((x) => x.name === traitElement.name)
                if (!trait) return
                trait.uploaded = true
              })
            )
            resolve({ traitElementId: traitElement.id, imageUrl: secure_url })
          } catch (err) {
            reject(err)
          }
        }
        reader.onloadend = () => {}
        reader.onabort = (err) => reject(err)
        reader.onerror = (err) => reject(err)
        reader.readAsBinaryString(file)
      })
    })
    await Promise.all(filePromises).then(() => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return
        const next = produce(old, (draft) => {
          const layer = draft.find((l) => l.id === layerElement.id)
          if (!layer) return
          layer.traitElements = response
        })
        return next
      })
      setUploadState('done')
    })
  }
  return { mutate, isLoading }
}
