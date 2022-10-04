import Button from '@components/Layout/Button'
import Loading from '@components/Layout/Loading'
import { Disclosure, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { Repository } from '@prisma/client'
import { formatBytes } from '@utils/format'
import { trpc } from '@utils/trpc'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import {
  getRepositoryLayerNames,
  getRepositoryLayerObjectUrls,
  uploadCollectionLayerImageCloudinary,
  validateFiles,
} from '../../utils/cloudinary'

const useMutateAddTraits = ({
  setUploadedFiles,
}: {
  setUploadedFiles: Dispatch<
    SetStateAction<{
      [key: string]: {
        name: string
        imageUrl: string
        path: string
        size: number
        uploaded: boolean
      }[]
    }>
  >
}) => {
  const { current: collection } = useQueryRepositoryCollection()
  const { mutate: createManyTrait } = trpc.useMutation('layer.createManyTrait')
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
        path: string
        size: number
        uploaded: boolean
      }[]
    }>
  >
}) => {
  const ctx = trpc.useContext()
  const { mutate: createRepository } = trpc.useMutation('repository.create')
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { notifyError, notifySuccess } = useNotification()
  const mutate = ({ files, organisationId }: { files: FileWithPath[]; organisationId: string }) => {
    // step 1: validate files
    if (!validateFiles(files, 3)) {
      alert("Something wrong with the format you've uploaded")
      return
    }
    notifySuccess('Folder format is correct. We are creating the project for you.')

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
          console.log('data', data)
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
                setUploadedFiles((prev) => {
                  if (!prev) return prev
                  const index = prev[layerName]?.findIndex((x) => x.name === traitElement.name)
                  const item = prev[layerName]?.find((x) => x.name === traitElement.name)
                  if (typeof index === 'undefined' || !item) return prev
                  prev[layerName] = [
                    ...(prev[layerName]?.slice(0, index) || []),
                    {
                      ...item,
                      uploaded: true,
                    },
                    ...(prev[layerName]?.slice(index + 1) || []),
                  ]
                  return prev
                })
              })
            }
            reader.readAsArrayBuffer(file)
          })
        },
        onError: (error) => {
          notifyError('Something went wrong')
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
      path: string
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
  const { mutate: createNewTraits } = useMutateAddTraits({
    setUploadedFiles,
  })

  const onDrop = useCallback(async (files: FileWithPath[]) => {
    // step 0: validate organisation
    if (!organisation) {
      alert('We coudlnt find your team. Please refresh the page to try again.')
      return
    }

    // step 1: find the folder depth length
    const folderDepth = files[0]?.path?.split('/').length

    switch (folderDepth) {
      case 4:
        createNewRepositoryAndLayers({ files, organisationId: organisation.id })
        return
      // case 2:
      // createNewTraits({ files, organisationId: organisation.id })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    noClick: true,
    noDrag: false,
  })

  return (
    <div className='space-y-6 w-full h-full'>
      {organisation ? (
        <>
          {Object.entries(uploadedFiles).length === 0 ? (
            <div className='h-[42.5vh]' {...getRootProps()}>
              <input {...getInputProps()} />
              <div className='border border-dashed hover:bg-lightGray border-blueHighlight rounded-[5px]  flex flex-col justify-center items-center h-full'>
                {acceptedFiles.length > 0 ? (
                  <Loading />
                ) : (
                  <>
                    <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
                    <span> to upload</span>
                    <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className='divide-y divide-mediumGrey space-y-3'>
              <div className='flex flex-row justify-between items-end'>
                <div className='flex flex-col space-y-2'>
                  <span className='text-2xl font-semibold'>All Layers & Traits</span>
                  <span className='text-xs'>Upload will start once all traits have been indexed</span>
                </div>
                <div className='flex space-x-3'>
                  <Button
                    onClick={() => {
                      repository && router.push(`/${organisation.name}/${repository.name}`)
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
                          <Disclosure.Button className={`border border-mediumGrey rounded-[5px] p-2 grid grid-cols-10 w-full`}>
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
                                      <div className='relative border border-mediumGrey rounded-[5px]'>
                                        <div className='pb-[100%]' />
                                        <Image layout='fill' src={item.imageUrl} className='rounded-[5px]' />
                                        {item.uploaded && (
                                          <CheckCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-greenDot m-1' />
                                        )}
                                        {/* <XCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-redError m-1' /> */}
                                      </div>
                                      <span className='text-xs overflow-scroll whitespace-nowrap no-scrollbar'>{item.name}</span>
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
      ) : null}
    </div>
  )
}

export default FolderUpload
