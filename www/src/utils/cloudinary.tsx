import { Cloudinary } from '@cloudinary/url-gen'
import { TraitElement } from '@prisma/client'
import { FileWithPath } from 'react-dropzone'
import { clientEnv } from 'src/env/schema.mjs'

export const MAX_BYTES_ALLOWED = 9990000

export const createCloudinary = () => {
  return new Cloudinary({
    cloud: {
      cloudName: 'rlxyz',
    },
  })
}

export const uploadCollectionLayerImageCloudinary = ({
  repositoryId,
  trait,
  file,
}: {
  repositoryId: string
  layerName: string
  file: FileWithPath
  trait: TraitElement
}) => {
  return new Promise((resolve, reject) => {
    const data = createCloudinaryFormData(file, trait, repositoryId)
    fetch('https://api.cloudinary.com/v1_1/rlxyz/image/upload', {
      method: 'post',
      body: data,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const validateFiles = (files: FileWithPath[], folderDepth: number): boolean => {
  const depth = folderDepth + 1 // + 1 because we are adding the root folder
  return files.filter((file) => file.path?.split('/').length !== depth || file.size > MAX_BYTES_ALLOWED).length === 0
}
export const getRepositoryLayerObjectUrls = (
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
export const getRepositoryLayerNames = (fileObject: {
  [key: string]: { name: string }[]
}): { layerName: string; traitNames: string[] }[] => {
  return Object.entries(fileObject).map(([key, values]) => ({ layerName: key, traitNames: values.map((x) => x.name) }))
}
export const createCloudinaryFormData = (file: FileWithPath, trait: TraitElement, repositoryId: string) => {
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
