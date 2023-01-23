import Image from 'next/image'
import { useEffect, useState } from 'react'
import { env } from 'src/env/client.mjs'

export const createLogoUrl = ({ id }: { id: string }) => {
  return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${env.NEXT_PUBLIC_NODE_ENV}/${id}/assets/logo`
}

export const LogoDisplay = ({ repositoryId }: { repositoryId?: string | null }) => {
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
    <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border border-mediumGrey bg-white'>
      <div className='block overflow-hidden absolute box-border m-0 rounded-[5px] bg-mediumGrey/70 animate-pulse-gradient-infinite inset-0'>
        {repositoryId && imgSrc && (
          <Image
            width={400}
            height={400}
            src={imgSrc}
            alt='logo-image'
            className='object-cover aspect-auto overflow-hidden rounded-[5px]'
          />
        )}
      </div>
    </div>
  )
}
