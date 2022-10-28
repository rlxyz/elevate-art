import { useNotification } from '@hooks/utils/useNotification'
import { formatBytes } from '@utils/format'
import clsx from 'clsx'
import React, { Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { env } from 'src/env/client.mjs'
import UploadDisplay from './upload-display'

interface Props {
  depth: number
  setUploadState?: (state: 'idle' | 'uploading' | 'done' | 'error') => void
  onDropCallback: ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<
      SetStateAction<{
        [key: string]: {
          name: string
          imageUrl: string
          size: number
          uploaded: boolean
        }[]
      }>
    >
    setUploadState: (state: 'idle' | 'uploading' | 'done' | 'error') => void
  }) => void
}

const defaultProps = {
  depth: 4,
  onDropCallback: ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<
      SetStateAction<{
        [key: string]: {
          name: string
          imageUrl: string
          size: number
          uploaded: boolean
        }[]
      }>
    >
    setUploadState: (state: 'idle' | 'uploading' | 'done' | 'error') => void
  }) => {},
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type UploadProps = Props & NativeAttrs

/**
 * This component is a wrapper around react-dropzone. Allows users to drop files into the browser.
 */
const Upload: React.FC<PropsWithChildren<UploadProps>> = ({
  depth,
  setUploadState,
  onDropCallback,
  children,
  className,
  ...props
}: React.PropsWithChildren<UploadProps> & typeof defaultProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: {
      name: string
      imageUrl: string
      size: number
      uploaded: boolean
    }[]
  }>({})
  const { notifyError } = useNotification()
  const [uploadState, setInternalUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')

  useEffect(() => {
    setUploadState && setUploadState(uploadState)
  }, [uploadState])

  const onDrop = useCallback(async (files: FileWithPath[]) => {
    const folderDepth = files[0]?.path?.split('/').length

    if (depth !== folderDepth) {
      notifyError('There seems to be something wrong with the folder format.')
    }
    // call the callback function with the files
    onDropCallback && onDropCallback({ files, setUploadedFiles, setUploadState: setInternalUploadState })
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
    <div>
      {Object.entries(uploadedFiles).length === 0 && children}
      {Object.entries(uploadedFiles).length === 0 && (
        <div {...props} className={clsx(className)} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className='border border-dashed hover:bg-lightGray border-blueHighlight rounded-[5px]  flex flex-col justify-center items-center h-full'>
            <span className='text-lg text-blueHighlight'>{!isDragActive ? `Drag your files here` : 'Drop them'}</span>
            <span> to upload</span>
            <span className='text-xs text-darkGrey'>
              Only PNG files supported, max file size {formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED)}
            </span>
          </div>
        </div>
      )}
      <div className='space-y-6'>
        {Object.entries(uploadedFiles).map((files) => (
          <UploadDisplay layerName={files[0]} traits={files[1]} />
        ))}
      </div>
    </div>
  )
}

Upload.displayName = 'Upload'
Upload.defaultProps = defaultProps
export default Upload
