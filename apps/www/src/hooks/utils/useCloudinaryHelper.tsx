import { Cloudinary } from '@cloudinary/url-gen'
import { createCloudinary } from '../../utils/cloudinary'

export const useCloudinaryHelper = (): { cld: Cloudinary } => {
  const cld = createCloudinary()
  return { cld }
}
