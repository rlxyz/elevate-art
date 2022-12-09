import { PageContainer } from '@Components/core/Layout/PageContainer'
import { ProjectInfo } from '@Components/core/Minter/ProjectInfo'
import { MintSection } from '@Components/core/MintSection/MintSection'
import { ProjectHeader } from '@Components/core/ProjectHeader'
import LogRocket from 'logrocket'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'
import { useAccount } from 'wagmi'

export const HomePage = () => {
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const repositoryName = router.query.repository as string
  const { data, isLoading } = useGetProjectDetail('rlxyz')
  const account = useAccount()

  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  return (
    <>
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
    </>
  )
}

export default HomePage
