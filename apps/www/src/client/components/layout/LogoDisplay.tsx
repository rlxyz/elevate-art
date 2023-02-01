import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { env } from 'src/env/client.mjs'

export const createLogoUrl = ({ id }: { id: string }) => {
  return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${env.NEXT_PUBLIC_NODE_ENV}/${id}/assets/logo`
}

export const LogoDisplay = ({ repositoryId, isSquare = false }: { repositoryId?: string | null; isSquare?: boolean }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(repositoryId ? createLogoUrl({ id: repositoryId }) : null)

  const fetchImage = async () => {
    if (!repositoryId) return
    const response = await fetch(createLogoUrl({ id: repositoryId }))

    if (!response.ok) {
      setImgSrc(null)
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    setImgSrc(url)
  }

  useEffect(() => {
    fetchImage()
  }, [repositoryId])

  return (
    <div
      className={clsx(
        'inline-flex -mt-8 md:-mt-20 w-[100px] h-[100px] md:w-[150px] md:h-[150px] basis-44 relative z-[1] bg-white ring-[1rem] ring-white',
        isSquare ? 'rounded-[5px]' : 'rounded-[9999px]'
      )}
    >
      <div
        className={clsx(
          'block overflow-hidden absolute box-border m-0 bg-mediumGrey/70 animate-pulse-gradient-infinite inset-0',
          isSquare ? 'rounded-[5px]' : 'rounded-full'
        )}
      >
        {repositoryId && imgSrc && (
          <Image
            width={400}
            height={400}
            src={createLogoUrl({ id: repositoryId })}
            alt='logo-image'
            className={clsx('object-cover aspect-auto overflow-hidden', isSquare ? 'rounded-[5px]' : 'rounded-full')}
          />
        )}
      </div>
    </div>
  )
}
