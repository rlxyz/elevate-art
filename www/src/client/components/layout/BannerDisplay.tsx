import Image from 'next/image'
import { env } from 'src/env/client.mjs'

export const createBannerUrl = ({ r }: { r: string }) => {
  return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${env.NEXT_PUBLIC_NODE_ENV}/${r}/assets/banner`
}

export const BannerDisplay = ({ repositoryId }: { repositoryId?: string | null }) => {
  return (
    <div className='h-72'>
      <div className='h-72 w-screen absolute left-0 border border-mediumGrey'>
        <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border h-full w-full'>
          <div className='block overflow-hidden absolute box-border m-0 rounded-[5px] bg-lightGray animate-pulse-gradient-infinite inset-0'>
            {repositoryId && (
              <Image
                src={createBannerUrl({ r: repositoryId })}
                alt='banner-image'
                width={2800}
                height={800}
                className='block object-cover m-auto overflow-hidden'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
