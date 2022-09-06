import { toPascalCaseWithSpace } from '@utils/format'
import { ReactNode, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const FileUpload = ({ id, children }: { id: string; children?: ReactNode }) => {
  const uploadCollectionLayerImageCloudinary = ({
    id,
    layerName,
    fileName,
    file,
  }: {
    id: string
    layerName: string
    fileName: string
    file: any
  }) => {
    return new Promise((resolve, reject) => {
      const key = `${id}/layers/${layerName}`
      const data = new FormData()
      data.append('file', file)
      data.append('public_id', toPascalCaseWithSpace(fileName))
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
          id: id,
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
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )} */}
    </div>
  )
}

export default FileUpload
