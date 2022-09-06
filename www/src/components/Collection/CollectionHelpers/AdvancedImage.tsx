import { fill } from '@cloudinary/url-gen/actions/resize'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createCloudinary } from '@utils/cloudinary'
import Image from 'next/image'
import { clientEnv } from 'src/env/schema.mjs'

export const SmallAdvancedImage = ({ url }: { url: string }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  if (!repositoryId) return <></>
  return (
    <div className={`rounded-[5px] border-[1px] border-mediumGrey h-[35px] w-[35px]`}>
      <Image
        priority
        src={cld
          .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${url}`)
          .resize(fill().width(35).height(35))
          .toURL()}
        width={35}
        height={35}
        className='rounded-[3px]'
      />
    </div>
  )
}

const AdvancedImage = ({ url }: { url: string }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  if (!repositoryId) return <></>
  return (
    <div className={`rounded-[5px] border-[1px] border-mediumGrey h-[125px] w-[125px]`}>
      <Image
        priority
        src={cld.image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${url}.png`).toURL()}
        width={130}
        height={130}
        className='rounded-[5px]'
      />
    </div>
  )
}

export default AdvancedImage
