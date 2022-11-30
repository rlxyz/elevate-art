import { TraitElementUploadState } from '@components/layout/upload/upload-display'
import { TraitElement } from '@prisma/client'
import produce from 'immer'
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

type ParseLayerElementFolderInput = { traitElements: TraitElement[]; files: FileWithPath[] }
type ParseLayerElementFolderOutput = { [key: string]: TraitElementUploadState[] }

/**
 * Note, this function is dynamic in that it infers the LayerElement & TraitElement name from the file path.
 * We also ensure that if a TraitElement already exists, or is readonly, we mark it as such (however, we still save the file data in the return)
 * @param opts ParseLayerElementFolderInput; a list of existing TraitElements, and a list of files
 * @todo ensure user doesn't accidently drop in his entire fucking Document folder like a dumbass.
 */
export const parseLayerElementFolder = (opts: ParseLayerElementFolderInput): ParseLayerElementFolderOutput => {
  const { files, traitElements } = opts
  const existing = traitElements.map((x) => x.name)
  const readonly = traitElements.filter((x) => x.readonly).map((x) => x.name)

  return files.reduce((acc, file: FileWithPath) => {
    /**
     * Little validation on path array since its optional from FileWithPath
     * Just ignore this. Should always work.
     */
    const pathArray = file.path?.split('/')
    if (!pathArray) return acc

    /**
     * Find TraitElement & LayerElement name is exist
     * @note l === layerElement name, t === traitElement name
     * @note also, technically, the TraitElement is always the last, followed by the LayerElement
     * @todo validate this traitElementName, ensure images are .png's
     */
    const l = pathArray[-2]?.replace('.png', '')
    const t = pathArray[-1]?.replace('.png', '')
    if (!l || !t) return acc

    /**
     * Append to the data structure
     * @note we use immer to ensure in-place mutation, its faster, i think.
     */
    return produce(acc, (draft) => {
      const layerElements = draft[l]
      if (!layerElements) return
      layerElements.push({
        name: t,
        imageUrl: URL.createObjectURL(file),
        size: file.size,
        uploaded: false,
        type: existing.includes(t) ? 'existing' : readonly.includes(t) ? 'readonly' : 'new',
      })
    })
  }, {} as ParseLayerElementFolderOutput)
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
