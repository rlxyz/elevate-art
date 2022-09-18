import { Repository, TraitElement } from '@prisma/client'
import { formatBytes } from '@utils/format'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { clientEnv } from 'src/env/schema.mjs'

export const FolderUpload = ({
  setRepository,
  onSuccess,
  organisationId,
}: {
  organisationId: string
  onSuccess: () => void
  setRepository?: Dispatch<SetStateAction<Repository | null>>
}) => {
  const [layers, setLayers] = useState<
    {
      name: string
      size: number
      current: number
      total: number
      progress: string
    }[]
  >([])
  const mr = trpc.useMutation('repository.create', {
    onSuccess: (data, variables) => setRepository && setRepository(data),
  })

  const ml = trpc.useMutation('layer.createMany', {
    onSuccess: (data, variables) => console.log('created all layers'),
  })

  const uploadCollectionLayerImageCloudinary = ({
    layerName,
    trait,
    file,
  }: {
    layerName: string
    file: any
    trait: TraitElement
  }) => {
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
        .then(async (response) => {
          const { bytes } = await response.json()
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
                progress: `w-[${(((layer.current + 1) / layer.total) * 100).toFixed(0)}%]`,
              },
              ...prev.slice(index + 1),
            ]
          })
          resolve(bytes)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const onDrop = useCallback(async (files: any) => {
    const repositoryName = files[0].path.split('/')[1]
    if (!repositoryName) return // should throw error
    mr.mutate(
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
          setLayers(
            layerNames.map((layer) => {
              return {
                name: layer.layerName,
                size: 0,
                current: 0,
                total: layer.traitNames.length,
                progress: 'w-[5%]',
              }
            })
          )
          ml.mutate(
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
    <div className='h-full space-y-6'>
      <div
        className='h-2/5 border border-dashed border-mediumGrey rounded-[5px] flex flex-col justify-center items-center'
        {...getRootProps()}
        onClick={open}
      >
        <input {...getInputProps()} />
        <div>
          <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
          <span> to upload</span>
        </div>
        <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
      </div>
      {layers && layers.length ? (
        <div className='h-2/5 overflow-y-scroll w-full flex flex-col justify-start space-y-6 divide-y divide-lightGray no-scrollbar'>
          {layers.map(({ name, size, current, total, progress }, index) => {
            return (
              <div key={`${name}-${index}`} className={`grid grid-cols-10 ${index !== 0 ? 'pt-3' : ''}`}>
                <div className='col-span-9 space-y-3 flex flex-col'>
                  <div className='flex space-x-3'>
                    <div className='flex items-center'>
                      <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                        <Image src={'/images/not-found.svg'} width={15} height={15} />
                      </div>
                    </div>
                    <div className='flex flex-col space-y-1'>
                      <span className='text-sm font-semibold'>{name}</span>
                      <span className='text-xs text-darkGrey'>{formatBytes(size)}</span>
                    </div>
                  </div>
                  <div className='w-full rounded-[5px] h-1 bg-lightGray'>
                    <div className={`bg-blueHighlight h-1 ${progress}`}></div>
                  </div>
                </div>
                <div className='col-span-1 flex flex-col'>
                  <div className='grid grid-rows-3 justify-items-end'>
                    {/* <XCircleIcon className='w-5 h-5 row-span-1' /> */}
                    <div />
                    <div />
                    <span className='text-sm'>
                      {current}/{total}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FolderUpload
