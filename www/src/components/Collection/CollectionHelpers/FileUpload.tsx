import Button from '@components/UI/Button'
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
    <div {...getRootProps()} className='w-full h-full'>
      <Button onClick={open}>
        <input {...getInputProps()} />
        <div>
          <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
          <span> to upload</span>
        </div>
        <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
      </Button>
    </div>
  )
}
export default FileUpload
