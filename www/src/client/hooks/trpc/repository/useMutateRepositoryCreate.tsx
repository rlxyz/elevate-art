import { UploadState } from '@components/layout/upload/upload'
import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import { Organisation, Repository } from '@prisma/client'
import { OrganisationNavigationEnum } from '@utils/enums'
import produce from 'immer'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { env } from 'src/env/client.mjs'
import { createCloudinaryFormData, getRepositoryLayerNames, getRepositoryUploadLayerObjectUrls } from '../../../utils/cloudinary'

export const useMutateRepositoryCreate = ({ setRepository }: { setRepository: Dispatch<SetStateAction<null | Repository>> }) => {
  const ctx = trpc.useContext()
  const { mutateAsync: createRepository } = trpc.repository.create.useMutation()
  const { notifyError, notifySuccess } = useNotification()
  const router = useRouter()
  const mutate = async ({
    files,
    setUploadedFiles,
    setUploadState,
    organisation,
    repository,
  }: {
    organisation: Organisation
    repository: Repository | string
    files: FileWithPath[]
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>
    setUploadState: (state: UploadState) => void
  }) => {
    try {
      console.log('files', organisation, repository)
      const layers = getRepositoryUploadLayerObjectUrls(files)
      setUploadedFiles(layers)
      notifySuccess('Upload format is correct. We are creating the project for you.')
      const response = await createRepository({
        organisationId: organisation.id,
        name: typeof repository === 'string' ? repository : repository.name, // little hack; if it's a string, it's a new repository
        layerElements: getRepositoryLayerNames(layers),
      })
      const { id: repositoryId, name: repositoryName } = response
      ctx.repository.findByName.setData({ repositoryName: response.name, organisationName: organisation.name }, response)

      notifySuccess('Project created. We are uploading the images now. Do not leave this page!')
      setUploadState('uploading')

      const filePromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          const pathArray = String(file.path).split('/')
          const layerName = pathArray[2]
          const traitName = pathArray[3]?.replace('.png', '')
          if (!traitName || !layerName) return
          const traitElement = response.layers.find((x) => x.name === layerName)?.traitElements.find((x) => x.name === traitName)
          if (!traitElement) return
          reader.onabort = () => reject({ traitElementId: traitElement.id, error: 'file reading was aborted' })
          reader.onerror = () => reject({ traitElementId: traitElement.id, error: 'file reading has failed' })
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
        router.push(
          `/${organisation.name}/${OrganisationNavigationEnum.enum.New}/order?name=${encodeURIComponent(repositoryName)}&id=${repositoryId}`
        )
      })
    } catch (e) {
      setUploadState('error')
      notifyError('Something went wrong. Please refresh the page to try again.')
      return
    }
  }

  return { mutate }
}
