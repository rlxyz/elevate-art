import { LayerElement, TraitElement } from '@prisma/client'
import { toPascalCaseWithSpace } from '@utils/format'
import { ReactNode, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { clientEnv } from 'src/env/schema.mjs'

const FileUpload = ({
  repositoryId,
  layers,
  children,
}: {
  repositoryId: string
  layers: (LayerElement & { traitElements: TraitElement[] })[]
  children?: ReactNode
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
      const _traitName = toPascalCaseWithSpace(fileName)
      const _layerName = toPascalCaseWithSpace(layerName)
      const traits = layers.filter((layer) => layer.name === _layerName)[0]?.traitElements
      if (!traits) return
      const trait = traits.filter((trait) => trait.name === _traitName)[0]
      if (!trait) return // todo: this returns if havent added trait to db. should add it if not
      const key = `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${trait.layerElementId}`
      const data = new FormData()
      data.append('file', file)
      data.append('public_id', trait.id)
      data.append('original_filename', _traitName)
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
    const allTraits = layers.flatMap((map) => map.traitElements.flatMap((map) => map))
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
          allTraits,
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

export default FileUpload
