import AvatarComponent from '@components/layout/avatar/Avatar'
import { createBannerUrl } from '@components/layout/BannerDisplay'
import { useNotification } from '@hooks/utils/useNotification'
import { useCallback, useEffect } from 'react'
import type { FileWithPath } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { createCloudinaryFormDataForBanner } from 'src/client/utils/cloudinary'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'

export const BannerImageUpload = ({ id }: { id: string }) => {
  const { notifyError, notifySuccess } = useNotification()
  const onDrop = useCallback(async (files: FileWithPath[]) => {
    if (files.length === 0) return

    if (!id) {
      return notifyError('Something went wrong. Please try again.')
    }

    const filePromises = files.map(async (file) => {
      return new Promise(async (resolve, reject) => {
        const reader = new FileReader()
        reader.onabort = () => reject(notifyError('File reading was aborted'))
        reader.onerror = () => reject(notifyError('File reading has failed'))
        reader.onload = async () => {
          try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: createCloudinaryFormDataForBanner(file, id),
            })
            const data = await response.json()
            const { secure_url } = data as { secure_url: string }
            if (secure_url) {
              return resolve({ repositoryId: id, imageUrl: secure_url })
            }
            return reject({ repositoryId: id, error: 'Something went wrong. Please try again.' })
          } catch (error) {
            console.error(error)
            return reject({ repositoryId: id, error: 'Something went wrong. Please try again.' })
          }
        }
        reader.readAsArrayBuffer(file)
      })
    })

    await Promise.all(filePromises).then((data) => {
      notifySuccess('Banner image uploaded successfully.')
    })
  }, [])

  const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    maxSize: env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED,
    noClick: true,
    noKeyboard: false,
  })

  useEffect(() => {
    if (fileRejections.length === 1) {
      notifyError(`File is too large. Please upload a file that is less than ${formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED)}.`)
    }

    if (fileRejections.length > 1) {
      notifyError(`Too many files. Please upload only one file.`)
    }
  }, [fileRejections.length])

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button type='button' onClick={open}>
        <AvatarComponent
          isSquare
          src={createBannerUrl({
            id: id,
          })}
          onError={(e) => {
            e.currentTarget.src = '/images/avatar-blank.png'
          }}
          variant='lg'
        />
      </button>
    </div>
  )
}
