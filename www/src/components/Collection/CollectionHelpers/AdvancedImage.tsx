import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { createCloudinary } from '@utils/cloudinary'
import Image from 'next/image'
import { clientEnv } from 'src/env/schema.mjs'

export const SmallAdvancedImage = ({ url }: { url: string }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  if (!repositoryId) return <></>
  return (
    <div className={`rounded-[5px] border border-mediumGrey h-[35px] w-[35px]`}>
      <Image
        priority
        src={cld.image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${url}`).toURL()}
        width={35}
        height={35}
        alt={`small-image-${url}`}
        className='rounded-[3px]'
      />
    </div>
  )
}
