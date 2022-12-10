import { useQuery } from '@tanstack/react-query'

import { data } from '../../../data'

const fetchProjectDetail = async () => {
  return new Promise<ProjectDetail>(async (resolve) => {
    setTimeout(
      () =>
        resolve({
          ...data,
        }),
      1000
    )
  })
}

interface ProjectDetail {
  projectName: string
  projectDescription: string
  projectOwner: string
  projectBanner: string
  projectProfileImage: string
  projectInfoBanner: string
  totalSupply: number
  ethPrice: number
  contractAddress: string
  maxAllocationPerAddress: number
  keywords: string
  websiteUrl: string
  twitterUrl: string
  discordUrl: string
  openseaUrl: string
}

interface UseGetProjectDetail {
  isLoading: boolean
  data: ProjectDetail
}

export const useGetProjectDetail = (projectSlug: string): UseGetProjectDetail => {
  const { data, isLoading } = useQuery<ProjectDetail, Error, ProjectDetail>([projectSlug], fetchProjectDetail)

  return {
    data,
    isLoading,
  }
}
