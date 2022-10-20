import Button from '@components/Layout/Button'
import { Disclosure, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { Repository, TraitElement } from '@prisma/client'
import { formatBytes } from '@utils/format'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import produce from 'immer'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import {
  getRepositoryLayerNames,
  getRepositoryLayerObjectUrls,
  uploadCollectionLayerImageCloudinary,
  validateFiles,
} from '../../utils/cloudinary'

const useMutateAddTraits = ({
  setUploadedFiles,
  setUploadedFilesV2,
}: {
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
  setUploadedFilesV2: Dispatch<
    SetStateAction<
      | (TraitElement & {
          imageUrl: string
          size: number
          state: 'idle' | 'uploaded' | 'error'
        })[]
      | undefined
    >
  >
}) => {
  const mutate = ({ files }: { files: FileWithPath[] }) => {
    // step 1: validate files
    if (!validateFiles(files, 1)) {
      alert("Something wrong with the format you've uploaded")
      return
    }

    // step 4: set repository data
    const layers = getRepositoryLayerObjectUrls(files)
    setUploadedFiles(layers)
  }
  return { mutate }
}

const useMutateCreateNewRepositoryAndLayers = ({
  setRepository,
  setUploadedFiles,
}: {
  setRepository: Dispatch<SetStateAction<null | Repository>>
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
}) => {
  const ctx = trpc.useContext()
  const { mutate: createRepository } = trpc.useMutation('repository.create')
  const { notifyError, notifySuccess } = useNotification()
  const mutate = ({ files, organisationId }: { files: FileWithPath[]; organisationId: string }) => {
    // step 1: validate files
    if (!validateFiles(files, 3)) {
      notifyError('There seems to be something wrong with the upload format.')
      return
    }

    notifySuccess('Upload format is correct. We are creating the project for you.')

    const repositoryName: string = (files[0]?.path?.split('/')[1] as string) || ''
    const layers = getRepositoryLayerObjectUrls(files)
    setUploadedFiles(layers)
    createRepository(
      { organisationId: organisationId, name: repositoryName, layerElements: getRepositoryLayerNames(layers) },
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
        onError: (error) => {
          notifyError('Something went wrong. Please refresh and try again.')
        },
      }
    )
  }

  return { mutate }
}

// Depth
// - if 1, then image images only
// - if 2, then layer folder
// - if 3, then a root folder with layer folder and then images
export const FolderUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: {
      name: string
      imageUrl: string
      size: number
      uploaded: boolean
    }[]
  }>({})
  const router = useRouter()
  const { current: organisation } = useQueryOrganisation()
  const [repository, setRepository] = useState<null | Repository>(null)
  const { mutate: createNewRepositoryAndLayers } = useMutateCreateNewRepositoryAndLayers({
    setUploadedFiles,
    setRepository,
  })
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { notifyError } = useNotification()

  const onDrop = useCallback(async (files: FileWithPath[]) => {
    // step 0: validate organisation
    if (!organisation) {
      notifyError('We couldnt find your team. Please refresh the page to try again.')
      return
    }

    // step 1: find the folder depth length
    const folderDepth = files[0]?.path?.split('/').length

    switch (folderDepth) {
      case 4:
        createNewRepositoryAndLayers({ files, organisationId: organisation.id })
        return
      default:
        notifyError('There seems to be something wrong with the folder format.')
    }
  }, [])

  useEffect(() => {
    console.log({ uploadedFiles })
  }, [uploadedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    noClick: true,
    noDrag: false,
  })

  const isLoading = !organisation

  return (
    <div className='min-h-[calc(100vh-7rem)]'>
      {Object.entries(uploadedFiles).length === 0 && (
        <div className='h-[40vh] flex items-center'>
          <div className='space-y-6'>
            <div className={clsx(isLoading && 'animate-pulse bg-mediumGrey rounded-[5px]')}>
              <span className={clsx(isLoading && 'invisible', 'text-5xl font-bold')}>Lets build something new.</span>
            </div>
            <div className={clsx(isLoading && 'animate-pulse bg-mediumGrey rounded-[5px]')}>
              <p className={clsx(isLoading && 'invisible', 'text-md')}>
                To create a new Project, set the name and add layers, or get started with one of our templates.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className='absolute left-0 w-full border-t border-border bg-white p-12 space-y-12'>
        <div className='space-y-6 w-full h-full'>
          {organisation ? (
            <>
              {Object.entries(uploadedFiles).length === 0 ? (
                <div className='h-[42.5vh]' {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className='border border-dashed hover:bg-lightGray border-blueHighlight rounded-[5px]  flex flex-col justify-center items-center h-full'>
                    <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
                    <span> to upload</span>
                    <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
                  </div>
                </div>
              ) : (
                <div className='min-h-[calc(100vh-7rem) divide-y divide-mediumGrey space-y-3'>
                  <div className='flex flex-row justify-between items-end'>
                    <div className='flex flex-col space-y-2'>
                      <span className='text-2xl font-semibold'>All Layers & Traits</span>
                      <span className='text-xs'>Upload will start once all traits have been indexed</span>
                    </div>
                    <div className='flex space-x-3'>
                      <Button
                        onClick={() => {
                          if (repository) {
                            setRepositoryId(repository.id)
                            router.push(`/${organisation.name}/${repository.name}`)
                          } else {
                            router.push('/')
                          }
                        }}
                        disabled={Object.entries(uploadedFiles).some(([, value]) => value.some((x) => !x.uploaded))}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                  <div className='space-y-6 py-3'>
                    {Object.entries(uploadedFiles).map((files) => {
                      return (
                        <Disclosure key={files[0]}>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className={`border border-border rounded-[5px] p-2 grid grid-cols-10 w-full`}>
                                <div className='col-span-9 space-y-3 flex flex-col'>
                                  <div className='flex space-x-3'>
                                    <div className='flex items-center'>
                                      <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                                        <Image src={'/images/not-found.svg'} width={15} height={15} />
                                      </div>
                                    </div>
                                    <div className='w-full items-start flex flex-col space-y-1'>
                                      <span className='text-sm font-semibold'>{files[0]}</span>
                                      <span className='text-xs text-darkGrey'>
                                        {formatBytes(files[1].reduce((a, b) => a + b.size, 0))}
                                      </span>
                                    </div>
                                  </div>
                                  <div className='flex items-start rounded-[5px] h-1 bg-lightGray text-left'>
                                    <motion.div
                                      // style={{ scaleX: 1 / 10 }}
                                      style={{ width: `${(files[1].filter((x) => x.uploaded).length / files[1].length) * 100}%` }}
                                      // style={{ scaleX: files[1].filter((x) => x.uploaded === true).length / files[1].length }}
                                      className={`bg-blueHighlight h-1`}
                                    />
                                  </div>
                                </div>
                                <div className='col-span-1 flex flex-col'>
                                  <div className='grid grid-rows-3 justify-items-end'>
                                    {open ? (
                                      <ChevronUpIcon className='w-3 h-3 row-span-1' />
                                    ) : (
                                      <ChevronDownIcon className='w-3 h-3 row-span-1' />
                                    )}
                                    <div />
                                    <span className='text-sm'>
                                      {files[1].filter((file) => file.uploaded).length} / {files[1].length}
                                    </span>
                                  </div>
                                </div>
                              </Disclosure.Button>
                              <Transition
                                show={open}
                                enter='transition duration-100 ease-out'
                                enterFrom='transform scale-95 opacity-0'
                                enterTo='transform scale-100 opacity-100'
                                leave='transition duration-75 ease-out'
                                leaveFrom='transform scale-100 opacity-100'
                                leaveTo='transform scale-95 opacity-0'
                              >
                                <Disclosure.Panel>
                                  <div className='grid grid-cols-12 gap-x-3 gap-y-3'>
                                    {files[1].map((item, index) => {
                                      return (
                                        <div key={`${item}-${index}`} className='flex flex-col space-y-1'>
                                          <div className='relative border border-border rounded-[5px]'>
                                            <div className='pb-[100%]' />
                                            <Image layout='fill' src={item.imageUrl} className='rounded-[5px]' />
                                            {item.uploaded && (
                                              <CheckCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-greenDot m-1' />
                                            )}
                                            {/* <XCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-redError m-1' /> */}
                                          </div>
                                          <span className='text-xs overflow-scroll whitespace-nowrap no-scrollbar'>
                                            {item.name}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='h-[42.5vh] w-full animate-pulse bg-mediumGrey rounded-[5px]'></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FolderUpload
