import { fill } from '@cloudinary/url-gen/actions/resize'
import { createCloudinary } from '@utils/cloudinary'
import Image from 'next/image'

const AdvancedImage = ({ url }: { url: string }) => {
  const cld = createCloudinary()
  return (
    <div
      className={`rounded-[5px] border-[1px] border-lightGray h-[125px] w-[125px]`}
    >
      <Image
        src={cld.image(url).resize(fill().width(125).height(125)).toURL()}
        width={125}
        height={125}
        className='rounded-[5px]'
      />
    </div>
  )
}

export default AdvancedImage
