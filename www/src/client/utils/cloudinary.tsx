import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import { TraitElement } from '@prisma/client'
import { FileWithPath } from 'react-dropzone'
import { env } from 'src/env/client.mjs'

export const DEFAULT_IMAGES_BYTES_ALLOWED = 9990000

export const validateFiles = (files: FileWithPath[], folderDepth: number): boolean => {
  const depth = folderDepth + 1 // + 1 because we are adding the root folder
  return (
    files.filter(
      (file) =>
        file.path?.split('/').length !== depth || file.size > (env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED || DEFAULT_IMAGES_BYTES_ALLOWED)
    ).length === 0
  )
}

export const getRepositoryUploadLayerObjectUrls = (files: FileWithPath[]): { [key: string]: TraitElementUploadState[] } => {
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
        type: 'new',
      } as TraitElementUploadState,
    ]
    return acc
  }, {})
}

export const getRepositoryLayerNames = (fileObject: {
  [key: string]: { name: string }[]
}): {
  name: string
  traitElements: {
    name: string
  }[]
}[] => {
  return Object.entries(fileObject).map(([key, values]) => ({
    name: key,
    traitElements: values.map((x) => {
      return {
        name: x.name,
      }
    }),
  }))
}

export const createCloudinaryFormData = (file: FileWithPath, trait: TraitElement, repositoryId: string) => {
  const { id, name, layerElementId } = trait
  const data = new FormData()
  data.append('file', file)
  data.append('public_id', id)
  data.append('original_filename', name)
  data.append('upload_preset', 'collection-upload')
  data.append('cloud_name', env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
  data.append('folder', `${env.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}`)
  return data
}
