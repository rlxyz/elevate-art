import { Layout } from '@Components/Layout/Layout'
import { PageContainer } from '@Components/Layout/PageContainer'
import { ProjectInfo } from '@Components/Minter/ProjectInfo'
import { MintSection } from '@Components/MintSection/MintSection'
import { ProjectHeader } from '@Components/ProjectHeader'
import { Spinner } from '@Components/Spinner/Spinner'
import { useGetProjectDetail } from '@Hooks/useGetProjectDetail'

export const Home = () => {
  const { data, isLoading } = useGetProjectDetail('rlxyz')

  if (isLoading) {
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <Layout>
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
    </Layout>
  )
}
