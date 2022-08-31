import { fill } from '@cloudinary/url-gen/actions/resize'
import { createCloudinary } from '@utils/cloudinary'
import Image from 'next/image'

export const SmallAdvancedImage = ({ url }: { url: string }) => {
  const cld = createCloudinary()
  return (
    <div className={`rounded-[5px] border-[1px] border-mediumGrey h-[35px] w-[35px]`}>
      <Image
        priority
        src={cld.image(url).resize(fill().width(35).height(35)).toURL()}
        width={35}
        height={35}
        className='rounded-[3px]'
      />
    </div>
  )
}

const AdvancedImage = ({ url, type = 'md' }: { url: string; type?: 'sm' | 'md' }) => {
  const cld = createCloudinary()
  return (
    <div className={`rounded-[5px] border-[1px] border-mediumGrey h-[125px] w-[125px]`}>
      <Image
        priority
        src={cld.image(url).resize(fill().width(125).height(125)).toURL()}
        width={130}
        height={130}
        className='rounded-[5px]'
      />
    </div>
  )
}

export default AdvancedImage
