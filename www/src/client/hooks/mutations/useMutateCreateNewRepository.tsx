import { Repository } from '@prisma/client'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { FileWithPath } from 'react-dropzone'
import { useQueryOrganisation } from 'src/client/hooks/query/useQueryOrganisation'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import {
  getRepositoryLayerNames,
  getRepositoryUploadLayerObjectUrls,
  uploadCollectionLayerImageCloudinary,
} from '../../../utils/cloudinary'

export const useMutateCreateNewRepository = ({ setRepository }: { setRepository: Dispatch<SetStateAction<null | Repository>> }) => {
  const ctx = trpc.useContext()
  const { current: organisation, isLoading } = useQueryOrganisation()
  const { mutate: createRepository } = trpc.useMutation('repository.create')
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
    // step 0: validate organisation
    if (isLoading || !organisation) {
      setUploadState('error')
      notifyError('We couldnt find your team. Please refresh the page to try again.')
      return
    }

    setUploadState('uploading')
    notifySuccess('Upload format is correct. We are creating the project for you.')

    const repositoryName: string = (files[0]?.path?.split('/')[1] as string) || ''
    const layers = getRepositoryUploadLayerObjectUrls(files)
    setUploadedFiles(layers)
    createRepository(
      { organisationId: organisation.id, name: repositoryName, layerElements: getRepositoryLayerNames(layers) },
      {
        onSuccess: (data, variables) => {
          setRepository(data)
          notifySuccess('We have created the project for you. Starting upload...')
          ctx.setQueryData(['repository.getRepositoryByName', { name: data.name }], data)
          files.map((file: FileWithPath) => {
            const reader = new FileReader()
            const pathArray = String(file.path).split('/')
            const layerName = pathArray[2]
            const traitName = pathArray[3]?.replace('.png', '')
            if (!traitName || !layerName) return
            // reader.onabort = () => console.error('file reading was aborted')
            // reader.onerror = () => console.error('file reading has failed')
            reader.onload = async () => {
              const traitElement = data.layers.find((x) => x.name === layerName)?.traitElements.find((x) => x.name === traitName)
              if (!traitElement) return
              uploadCollectionLayerImageCloudinary({
                file,
                traitElement,
                repositoryId: data.id,
              }).then(() => {
                setUploadedFiles((state) =>
                  produce(state, (draft) => {
                    const trait = draft[layerName]?.find((x) => x.name === traitName)
                    if (!trait) return
                    trait.uploaded = true
                  })
                )
              })
            }
            reader.readAsArrayBuffer(file)
          })
        },
        onSettled: () => {
          setUploadState('done')
        },
        onError: (error) => {
          notifyError('Something went wrong. Please refresh and try again.')
          setUploadState('error')
        },
      }
    )
  }

  return { mutate }
}
