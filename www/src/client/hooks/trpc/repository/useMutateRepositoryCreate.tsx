import { UploadState } from '@components/layout/upload/upload'
import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import { Repository } from '@prisma/client'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import { trpc } from 'src/client/utils/trpc'
import { env } from 'src/env/client.mjs'
import { createCloudinaryFormData, getRepositoryLayerNames, getRepositoryUploadLayerObjectUrls } from '../../../utils/cloudinary'
import { useMutationContext } from '../useMutationContext'

export const useMutateRepositoryCreate = ({ repository }: { repository: Repository | null }) => {
  const { ctx, notifyError, notifySuccess, notifyInfo } = useMutationContext()
  const { mutateAsync: createLayerElements } = trpc.layerElement.createMany.useMutation({
    onSuccess: (data) => {
      if (!repository) return
      ctx.layerElement.findAll.setData(
        { repositoryId: repository?.id },
        data.map((x) => ({
          ...x,
          traitElements: x.traitElements.map((y) => ({
            ...y,
            rulesPrimary: [],
            rulesSecondary: [],
          })),
        }))
      )
    },
  })

  const mutate = async ({
    repository,
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    repository: Repository
    files: FileWithPath[]
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>
    setUploadState: (state: UploadState) => void
  }) => {
    try {
      const layers = getRepositoryUploadLayerObjectUrls(files)
      setUploadedFiles(layers), notifyInfo('We are uploading the images now. Do not leave this page!'), setUploadState('uploading')
      const response = await createLayerElements({ layerElements: getRepositoryLayerNames(layers), repositoryId: repository.id })
      console.log('response', response)
      const filePromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          const pathArray = String(file.path).split('/')
          const layerName = pathArray[2]
          const traitName = pathArray[3]?.replace('.png', '')
          if (!traitName || !layerName) return
          const traitElement = response.find((x) => x.name === layerName)?.traitElements.find((x) => x.name === traitName)
          if (!traitElement) return
          reader.onabort = () => reject({ traitElementId: traitElement.id, error: 'file reading was aborted' })
          reader.onerror = () => reject({ traitElementId: traitElement.id, error: 'file reading has failed' })
          reader.onload = async () => {
            try {
              const response = await fetch(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'post',
                body: createCloudinaryFormData(file, traitElement, repository?.id),
              })
              const data = await response.json()
              const { secure_url } = data as { secure_url: string }
              setUploadedFiles((state) =>
                produce(state, (draft) => {
                  const trait = draft[layerName]?.find((x) => x.name === traitName)
                  if (!trait) return
                  trait.uploaded = true
                })
              )
              resolve({ traitElementId: traitElement.id, imageUrl: secure_url })
            } catch (err) {
              reject({ traitElementId: traitElement.id, error: 'something went wrong when uploading' })
            }
          }
          reader.readAsArrayBuffer(file)
        })
      })

      await Promise.all(filePromises).then((data) => {
        setUploadState('done')
        notifySuccess('Traits created and uploaded successfully')
      })
      return
    } catch (e) {
      console.error(e)
      setUploadState('error')
      notifyError('Something went wrong. Please refresh the page to try again.')
      return
    }
  }

  return { mutate }
}
