import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'

import { Layout } from '../Layout/Layout'
import { PageContainer } from '../Layout/PageContainer'
import { ProjectInfo } from '../Minter/ProjectInfo'
import { MintSection } from '../MintSection/MintSection'
import { ProjectHeader } from '../ProjectHeader'
import { Spinner } from '../Spinner/Spinner'

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
