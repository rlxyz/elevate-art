import { fill } from '@cloudinary/url-gen/actions/resize'
import { createCloudinary } from '@utils/cloudinary'
import Image from 'next/image'

const AdvancedImage = ({
  url,
  type = 'md',
}: {
  url: string
  type?: 'sm' | 'md'
}) => {
  const cld = createCloudinary()

  if (type === 'sm') {
    return (
      <div
        className={`rounded-[5px] border-[1px] border-lightGray h-[30px] w-[30px]`}
      >
        <Image
          src={cld.image(url).resize(fill().width(30).height(30)).toURL()}
          width={30}
          height={30}
          className='rounded-[5px]'
        />
      </div>
    )
  }

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
