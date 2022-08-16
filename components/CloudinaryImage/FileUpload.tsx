import { ReactNode, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const FileUpload = ({
  id,
  children,
  onUpload,
}: {
  id: string
  children?: ReactNode
  onUpload?: () => void
}) => {
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
      data.append(
        'public_id',
        `${fileName
          .toLowerCase()
          .replace(/(\s+)/g, '-')
          .replace(
            new RegExp(/\s+(.)(\w*)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3}`
          )
          .replace(new RegExp(/\w/), (s) => s.toUpperCase())}`
      )
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

  const onDrop = useCallback(async (files) => {
    files.forEach((file) => {
      const reader = new FileReader()
      const pathArray = String(file.path).split('/')
      const layerName = pathArray[1]
      const fileName = pathArray[2].replace('.png', '')
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        uploadCollectionLayerImageCloudinary({
          id: id,
          fileName: fileName,
          layerName: layerName,
          file: file,
        })
          .then((response) => {
            // todo: handle upload success
            console.log(response)
          })
          .catch((err) => {
            // todo: handle error
            console.error(err)
          })
      }
      reader.readAsArrayBuffer(file)
    })
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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
    </div>
  )
}

export default FileUpload
