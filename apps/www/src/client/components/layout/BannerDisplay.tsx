import Image from 'next/image'
import { useEffect, useState } from 'react'
import { env } from 'src/env/client.mjs'

export const createBannerUrl = ({ id }: { id: string }) => {
  return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${env.NEXT_PUBLIC_NODE_ENV}/${id}/assets/banner`
}

export const defaultBannerUrl = '/images/EA_Default_Banner.png'

type BannerDisplayProps = {
  id?: string | null
}

export const BannerDisplay = ({ id }: BannerDisplayProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(id ? createBannerUrl({ id }) : null)

  const fetchImage = async () => {
    if (!id) return
    try {
      const response = await fetch(createBannerUrl({ id }))
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setImgSrc(url)
    } catch (error) {
      console.error(error)
      setImgSrc(defaultBannerUrl)
    }
  }

  useEffect(() => {
    console.log('imgSrc: ', imgSrc)
    fetchImage()
  }, [id])

  return (
    <div className='h-32 lg:h-72'>
      <div className='h-32 lg:h-72 w-screen absolute left-0'>
        <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border h-full w-full'>
          <div className='block overflow-hidden absolute box-border m-0 bg-lightGray animate-pulse-gradient-infinite inset-0'>
            {id && imgSrc && (
              <Image
                src={imgSrc}
                alt='banner-image'
                width={1400}
                height={350}
                className='object-cover h-full w-full m-auto block overflow-hidden'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
