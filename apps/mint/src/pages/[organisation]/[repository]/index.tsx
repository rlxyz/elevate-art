import { ProjectInfo } from '@Components/core/Minter/ProjectInfo'
import { MintLayout } from '@Components/core/MintLayout'
import { MintSection } from '@Components/core/MintSection/MintSection'
import { Layout } from '@Components/layout/core/Layout'
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
    <Layout>
      <Layout.Header
        internalRoutes={[
          {
            current: `${organisationName}`,
            href: `/${organisationName}`,
          },
          {
            current: `${repositoryName}`,
            href: `/${organisationName}/${repositoryName}`,
          },
        ]}
      />
      <Layout.Body margin={false}>
        <MintLayout>
          <MintLayout.Header bannerImageUrl={'/images/moonbirds-banner.png'} profileImageUrl={'/images/moonbirds-profile.avif'} />
          <div className='px-5 lg:px-16 2xl:px-32 py-12 pb-20 grid gap-4 grid-cols-1 md:grid-cols-2'>
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
            <div className='ml-5'>
              <MintSection />
            </div>
          </div>
        </MintLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
