import { PageContainer } from '@Components/Layout/PageContainer'
import { ProjectHeader } from '@Components/ProjectHeader'
import { useGetProjectDetail } from '@Hooks/useGetProjectDetail'
import LogRocket from 'logrocket'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

const ProjectInfo = dynamic(
  () => import('@Components/Minter/ProjectInfo').then(mod => mod.ProjectInfo),
  { ssr: false },
)

const MintSection = dynamic(
  () => import('@Components/MintSection/MintSection').then(mod => mod.MintSection),
  { ssr: false },
)

export const HomePage = () => {
  const { data } = useGetProjectDetail('rlxyz')
  const account = useAccount()

  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  return (
    <PageContainer
      header={
        <ProjectHeader
          bannerImageUrl={data?.projectBanner}
          profileImageUrl={data?.projectProfileImage}
          projectOwner={data?.projectOwner}
        />
      }
      leftContent={
        <ProjectInfo
          projectName={data?.projectName}
          projectDescription={data?.projectDescription}
          bannerImageUrl={data?.projectInfoBanner}
          discordUrl={data?.discordUrl}
          twitterUrl={data?.twitterUrl}
          openseaUrl={data?.openseaUrl}
          price={data?.ethPrice}
          supply={data?.totalSupply}
        />
      }
      rightContent={<MintSection />}
    />
  )
}

export default HomePage
