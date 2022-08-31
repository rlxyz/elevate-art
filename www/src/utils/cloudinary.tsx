import { Cloudinary } from '@cloudinary/url-gen'

export const createCloudinary = () => {
  return new Cloudinary({
    cloud: {
      cloudName: 'rlxyz',
    },
  })
}
