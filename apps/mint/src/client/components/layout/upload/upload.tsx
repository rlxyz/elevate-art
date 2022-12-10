import clsx from 'clsx'
import React, { Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import UploadDisplay, { TraitElementUploadState } from './upload-display'

export type UploadState = 'idle' | 'uploading' | 'done' | 'error'

interface Props {
  depth: number
  gridSize: 'md' | 'lg'
  withTooltip: boolean
  setUploadState?: (state: UploadState) => void
  onDropCallback: ({
    files,
    setUploadedFiles,
    setUploadState,
  }: {
    files: FileWithPath[]
    setUploadedFiles: Dispatch<SetStateAction<{ [key: string]: TraitElementUploadState[] }>>
    setUploadState: (state: UploadState) => void
  }) => void
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
  gridSize,
  withTooltip,
  ...props
}: React.PropsWithChildren<UploadProps>) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: TraitElementUploadState[] }>({})
  const [internalUploadState, setInternalUploadState] = useState<UploadState>('idle')
  const { notifySuccess, notifyError } = useNotification()

  useEffect(() => {
    const state = internalUploadState
    setUploadState && setUploadState(state)
    if (state === 'done') {
      notifySuccess('Successfully created and uploaded the traits.')
    } else if (state === 'error') {
      notifyError('Something went wrong with the upload. Please refresh the page to try again.')
    } else if (state === 'uploading') {
      notifySuccess('Uploading your new traits and their associated images.')
    }
  }, [internalUploadState])

  const onDrop = useCallback(async (files: FileWithPath[]) => {
    const folderDepth = files[0]?.path?.split('/').length

    if (depth !== folderDepth) {
      setInternalUploadState('error')
      notifyError('There seems to be something wrong with the folder format.')
      return
    }

    onDropCallback({ files, setUploadedFiles, setUploadState: setInternalUploadState })
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
        {Object.entries(uploadedFiles).map((files, index) => (
          <UploadDisplay
            key={`${index}-${files[0]}`}
            layerName={files[0]}
            traits={files[1]}
            gridSize={gridSize}
            withTooltip={withTooltip}
          />
        ))}
      </div>
    </div>
  )
}

Upload.displayName = 'Upload'
export default Upload
