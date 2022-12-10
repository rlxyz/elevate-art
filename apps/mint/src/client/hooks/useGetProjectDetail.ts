import { trpc } from '@Utils/trpc'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'

// import { data } from '../../../data'

// const fetchProjectDetail = async () => {
//   return new Promise<ProjectDetail>(async (resolve) => {
//     setTimeout(
//       () =>
//         resolve({
//           ...data,
//         }),
//       1000
//     )
//   })
// }

// interface ProjectDetail {
//   projectName: string
//   projectDescription: string
//   projectOwner: string
//   projectBanner: string
//   projectProfileImage: string
//   projectInfoBanner: string
//   totalSupply: number
//   ethPrice: number
//   contractAddress: string
//   maxAllocationPerAddress: number
//   keywords: string
//   websiteUrl: string
//   twitterUrl: string
//   discordUrl: string
//   openseaUrl: string
// }

// interface UseGetProjectDetail {
//   isLoading: boolean
//   data: ProjectDetail | undefined | null
// }

export const useGetProjectDetail = () => {
  const router: NextRouter = useRouter()
  const { address } = router.query as { address: string }
  // const { data, isLoading } = useQuery<ProjectDetail, Error, ProjectDetail>([projectSlug], fetchProjectDetail)
  const { data, isLoading, isError } = trpc.contractDeploymentRouter.findByAddress.useQuery({ address })
  return {
    data,
    isLoading,
    isError,
  }
}
