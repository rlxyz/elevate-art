import Button from '@components/UI/Button'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import { Organisation, Repository, TraitElement } from '@prisma/client'
import { formatBytes } from '@utils/format'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { clientEnv } from 'src/env/schema.mjs'

const MAX_BYTES_ALLOWED = 9990000
const getRepositoryLayerObjects = (files: any): { [key: string]: string[] } => {
  return files.reduce(
    (acc: any, cur: any) => (
      (acc[cur.path.split('/')[2]] = [...(acc[cur.path.split('/')[2]] || []), cur.path.split('/')[3].replace('.png', '')]), acc
    ),
    {}
  )
}

const validateFiles = (files: FileWithPath[]): boolean => {
  return files.filter((file) => file.path?.split('/').length !== 4 || file.size > MAX_BYTES_ALLOWED).length === 0
}

const getRepositoryLayerObjectUrls = (
  files: FileWithPath[]
): { [key: string]: { name: string; imageUrl: string; path: string; size: number; uploaded: boolean }[] } => {
  return files.reduce((acc: any, file: FileWithPath) => {
    const pathArray = file.path?.split('/') || []
    const layerName: string = pathArray[2] || ''
    const traitName: string = pathArray[3]?.replace('.png', '') || ''
    acc[layerName] = [
      ...(acc[layerName] || []),
      {
        name: traitName,
        imageUrl: URL.createObjectURL(file),
        path: file.path,
        size: file.size,
        uploaded: false,
      },
    ]
    return acc
  }, {})
}

const getRepositoryLayerNames = (fileObject: { [key: string]: string[] }): { layerName: string; traitNames: string[] }[] => {
  return Object.entries(fileObject).map(([key, value]) => ({ layerName: key, traitNames: value }))
}

const createCloudinaryFormData = (file: any, trait: TraitElement, repositoryId: string) => {
  const { id, name, layerElementId } = trait
  const data = new FormData()
  data.append('file', file)
  data.append('public_id', id)
  data.append('original_filename', name)
  data.append('upload_preset', 'collection-upload')
  data.append('cloud_name', 'rlxyz')
  data.append('folder', `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}`)
  return data
}

export const FolderUpload = ({ onSuccess, organisation }: { organisation: Organisation; onSuccess: () => void }) => {
  const [layers, setLayers] = useState<
    {
      name: string
      size: number
      current: number
      total: number
      progress: string
    }[]
  >([])
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: {
      name: string
      imageUrl: string
      path: string
      size: number
      uploaded: boolean
    }[]
  } | null>()
  const router = useRouter()
  const { mutate: createRepository } = trpc.useMutation('repository.create')
  const { mutate: createLayers } = trpc.useMutation('layer.createMany')
  const { mutate: deleteRepository } = trpc.useMutation('repository.delete', {
    onSuccess: () => {
      router.push(`/${organisation.name}`)
    },
  })

  const { notifySuccess, notifyError } = useNotification()
  const uploadCollectionLayerImageCloudinary = ({
    repositoryId,
    layerName,
    trait,
    file,
  }: {
    repositoryId: string
    layerName: string
    file: any
    trait: TraitElement
  }) => {
    return new Promise((resolve, reject) => {
      const data = createCloudinaryFormData(file, trait, repositoryId)
      fetch('https://api.cloudinary.com/v1_1/rlxyz/image/upload', {
        method: 'post',
        body: data,
      })
        .then(async (response) => {
          const data = await response.json()
          const { bytes } = data
          setLayers((prev) => {
            const layer = prev.find((layer) => layer.name === layerName)
            const index = prev.findIndex((layer) => layer.name === layerName)
            if (!layer || !index) return [...prev]
            return [
              ...prev.slice(0, index),
              {
                name: layer.name,
                size: layer.size + bytes,
                current: layer.current + 1,
                total: layer.total,
                progress: `w-[${Math.round((((layer.current + 1) / layer.total) * 100) / 10) * 10}%]`,
              },
              ...prev.slice(index + 1),
            ]
          })
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  const [repository, setRepository] = useState<Repository>()

  const onDrop = useCallback(async (files: any) => {
    if (!validateFiles(files)) {
      alert("Something wrong with the format you've uploaded")
      return
    }

    // notifySuccess(
    //   <div>
    //     <span>Successfully</span> uploaded <span className='text-blueHighlight'>{files.length} files</span>
    //   </div>,
    //   'new files'
    // )

    // step 2: get repository name
    const repositoryName: string = files[0].path.split('/')[1] as string

    // step 3: create repository
    createRepository(
      { organisationId: organisation.id, name: repositoryName },
      {
        onSuccess: (data) => {
          // step 4: set repository data
          setUploadedFiles(getRepositoryLayerObjectUrls(files))
          setRepository(data)

          return
          // step 5: get layer objects
          const layers: { layerName: string; traitNames: string[] }[] = getRepositoryLayerNames(getRepositoryLayerObjects(files))

          // step 6: set layers
          setLayers(
            layers.map((layer) => {
              return {
                name: layer.layerName,
                size: 0,
                current: 0,
                total: layer.traitNames.length,
                progress: 'w-[5%]',
              }
            })
          )

          // step 7: create layers
          createLayers(
            { repositoryId: data.id, layers },
            {
              onSuccess: (data, variables) => {
                files.map((file: any) => {
                  const reader = new FileReader()
                  const pathArray = String(file.path).split('/')
                  const layerName = pathArray[2]
                  const traitName = pathArray[3]?.replace('.png', '')
                  // reader.onabort = () => console.log('file reading was aborted')
                  reader.onerror = () => console.log('file reading has failed')
                  reader.onload = async () => {
                    if (!traitName || !layerName) return // todo: throw error
                    const trait = data.filter((item) => item.name === traitName)[0]
                    if (!trait) return // todo: throw error
                    uploadCollectionLayerImageCloudinary({
                      repositoryId: variables.repositoryId,
                      layerName,
                      trait,
                      file,
                    })
                  }
                  reader.readAsArrayBuffer(file)
                  onSuccess()
                })
              },
            }
          )
        },
        onError: (error) => {
          notifyError('Something went wrong')
        },
      }
    )
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    noClick: true,
    noDrag: false,
  })

  return (
    <div className='space-y-6 w-full'>
      {!uploadedFiles && (
        <div className='h-[20rem]' {...getRootProps()}>
          <input {...getInputProps()} />
          <div className='border border-dashed border-mediumGrey rounded-[5px]  flex flex-col justify-center items-center h-full'>
            <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
            <span> to upload</span>
            <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
          </div>
        </div>
      )}
      {uploadedFiles ? (
        <div className='divide-y divide-mediumGrey space-y-3'>
          <div className='flex flex-row justify-between items-end'>
            <div className='flex flex-col space-y-2'>
              <span className='text-2xl font-semibold'>All Layers & Traits</span>
              <span className='text-xs'>Upload will start once all traits have been indexed</span>
            </div>
            <div className='flex space-x-3'>
              <Button
                variant='secondary'
                onClick={() => {
                  if (repository) {
                    deleteRepository({ repositoryId: repository.id })
                  } else {
                    router.push(`/${organisation.name}`)
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                // onClick={() => router.push(`/${organisationName}/${repository?.name}/preview`)} // todo: should go to collection creation page
                // disabled={repository === null && createProjectDisabled}
                disabled
              >
                Create Project
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
                          <div className='w-full rounded-[5px] h-1 bg-lightGray'>
                            <div className={`bg-blueHighlight h-1 w-[1%]`}></div>
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
                            {files[1].map((item) => {
                              return (
                                <div className='flex flex-col space-y-1'>
                                  <div className='relative border border-mediumGrey rounded-[5px]'>
                                    <div className='pb-[100%]' />
                                    <Image layout='fill' src={item.imageUrl} className='rounded-[5px]' />
                                    {/* <CheckCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-greenDot m-1' /> */}
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
      ) : (
        <></>
      )}
    </div>
  )
}

export default FolderUpload
