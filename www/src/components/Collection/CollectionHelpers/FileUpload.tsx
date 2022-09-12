import { LayerElement, Repository, TraitElement } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { Dispatch, ReactNode, SetStateAction, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { clientEnv } from 'src/env/schema.mjs'

const FileUpload = ({
  repositoryId,
  layers,
  children,
  type = 'new',
}: {
  repositoryId?: string
  layers?: (LayerElement & { traitElements: TraitElement[] })[]
  children?: ReactNode
  type: 'new' | 'edit'
}) => {
  const uploadCollectionLayerImageCloudinary = ({
    allTraits,
    layerName,
    fileName,
    file,
  }: {
    allTraits: TraitElement[]
    layerName: string
    fileName: string
    file: any
  }) => {
    return new Promise((resolve, reject) => {
      // find the layer & trait element id
      const trait = allTraits.filter((trait) => trait.name === fileName)[0]
      if (!trait) return // todo: this returns if havent added trait to db. should add it if not
      const key = `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${trait.layerElementId}`
      const data = new FormData()
      data.append('file', file)
      data.append('public_id', trait.id)
      data.append('original_filename', fileName)
      data.append('upload_preset', 'collection-upload')
      data.append('cloud_name', 'rlxyz')
      data.append('folder', key)
      fetch('https://api.cloudinary.com/v1_1/rlxyz/image/upload', {
        method: 'post',
        body: data,
      })
        .then((response) => {
          resolve(response.json())
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const onDrop = useCallback(async (files: any) => {
    const allTraits = layers?.flatMap((map) => map.traitElements.flatMap((map) => map))
    files.forEach((file: any) => {
      const reader = new FileReader()
      const pathArray = String(file.path).split('/')
      const layerName = pathArray[1]
      const fileName = pathArray[2]?.replace('.png', '')
      // reader.onabort = () => console.log('file reading was aborted')
      // reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        if (!fileName || !layerName) return // todo: throw error
        uploadCollectionLayerImageCloudinary({
          allTraits: allTraits || [],
          fileName: fileName,
          layerName: layerName,
          file: file,
        })
          .then((_) => {
            // todo: handle upload success
            // console.log(response)
          })
          .catch((_) => {
            // todo: handle error
            // console.error(err)
          })
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    noClick: true,
    noDrag: false,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
      {/* {isDragActive ? (
        <p className='text-xs ml-5'>Drop the files here ...</p>
      ) : (
        <p className='text-xs ml-5'>Drag and drop some files here, or click to select files</p>
      )} */}
    </div>
  )
}

export const FolderUpload = ({
  setRepository,
  onSuccess,
  organisationId,
}: {
  organisationId: string
  onSuccess: () => void
  setRepository: Dispatch<SetStateAction<Repository | null>>
}) => {
  const mutation = trpc.useMutation('repository.create', {
    onSuccess: (data, variables) => setRepository(data),
  })

  const mutationLayer = trpc.useMutation('layer.createMany', {
    onSuccess: (data, variables) => console.log('created all layers'),
  })

  const uploadCollectionLayerImageCloudinary = ({ trait, file }: { file: any; trait: TraitElement }) => {
    return new Promise((resolve, reject) => {
      const key = `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${organisationId}/${trait.layerElementId}`
      const data = new FormData()
      data.append('file', file)
      data.append('public_id', trait.id)
      data.append('original_filename', trait.name)
      data.append('upload_preset', 'collection-upload')
      data.append('cloud_name', 'rlxyz')
      data.append('folder', key)
      fetch('https://api.cloudinary.com/v1_1/rlxyz/image/upload', {
        method: 'post',
        body: data,
      })
        .then((response) => {
          resolve(response.json())
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const onDrop = useCallback(async (files: any) => {
    const repositoryName = files[0].path.split('/')[1]
    if (!repositoryName) return // should throw error
    mutation.mutate(
      { organisationId, name: repositoryName },
      {
        onSuccess: (data) => {
          const fileObject: { [key: string]: string[] } = files.reduce(
            (acc: any, cur: any) => (
              (acc[cur.path.split('/')[2]] = [
                ...(acc[cur.path.split('/')[2]] || []),
                cur.path.split('/')[3].replace('.png', ''),
              ]),
              acc
            ),
            {}
          )
          const layerNames = Object.entries(fileObject).map(([key, value]) => ({ layerName: key, traitNames: value }))
          mutationLayer.mutate(
            { repositoryId: data.id, layers: layerNames },
            {
              onSuccess: (data) => {
                files.map((file: any) => {
                  const reader = new FileReader()
                  const pathArray = String(file.path).split('/')
                  const layerName = pathArray[2]
                  const traitName = pathArray[3]?.replace('.png', '')
                  reader.onabort = () => console.log('file reading was aborted')
                  reader.onerror = () => console.log('file reading has failed')
                  reader.onload = async () => {
                    if (!traitName || !layerName) return // todo: throw error
                    const trait = data.filter((item) => item.name === traitName)[0]
                    if (!trait) return // todo: throw error
                    uploadCollectionLayerImageCloudinary({
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
      }
    )
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    noClick: true,
    noDrag: false,
  })

  return (
    <div
      {...getRootProps()}
      onClick={open}
      className='h-full border border-dashed border-mediumGrey rounded-[5px] flex flex-col justify-center items-center'
    >
      <input {...getInputProps()} />
      <div>
        <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
        <span> to upload</span>
      </div>
      <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
      {/* <div className='h-2/6 overflow-y-scroll w-full flex flex-col justify-start space-y-6 divide-y divide-lightGray no-scrollbar'>
                {[
                  {
                    trait: 'Background',
                    size: 10,
                    current: 4,
                    total: 5,
                    progress: 75,
                  },
                  {
                    trait: 'Scenery',
                    size: 13.255,
                    current: 4,
                    total: 13,
                    progress: 60,
                  },
                  {
                    trait: 'Clamps',
                    size: 7.5,
                    current: 1,
                    total: 13,
                    progress: 30,
                  },
                  {
                    trait: 'Accessories',
                    size: 7.5,
                    current: 10,
                    total: 13,
                    progress: 70,
                  },
                  {
                    trait: 'Arms',
                    size: 7.5,
                    current: 6,
                    total: 15,
                    progress: 20,
                  },
                ].map(({ trait, size, current, total }, index) => {
                  return (
                    <div key={`${trait}-${index}`} className={`grid grid-cols-10 ${index !== 0 ? 'pt-3' : ''}`}>
                      <div className='col-span-9 space-y-3 flex flex-col'>
                        <div className='flex space-x-3'>
                          <div className='flex items-center'>
                            <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                              <Image src={'/images/not-found.svg'} width={15} height={15} />
                            </div>
                          </div>
                          <div className='flex flex-col space-y-1'>
                            <span className='text-sm font-semibold'>{trait}</span>
                            <span className='text-xs text-darkGrey'>{size.toFixed(1)} MB</span>
                          </div>
                        </div>
                        <div className='w-full rounded-[5px] h-1 bg-lightGray'>
                          <div className={`bg-blueHighlight h-1 w-[50%]`}></div>
                        </div>
                      </div>
                      <div className='col-span-1 flex flex-col'>
                        <div className='grid grid-rows-3 justify-items-end'>
                          <XCircleIcon className='w-5 h-5 row-span-1' />
                          <div />
                          <span className='text-sm'>
                            {current}/{total}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div> */}
    </div>
  )
}

export default FileUpload
