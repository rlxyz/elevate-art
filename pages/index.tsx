import { MintSection } from '@Components/Minter/MintSection'
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

export const HomePage = () => {
  const { data } = useGetProjectDetail('rlxyz')
  const account = useAccount()

  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  return (
    <>
      <ProjectHeader
        bannerImageUrl={data?.projectBanner}
        profileImageUrl={data?.projectProfileImage}
        projectOwner={data?.projectOwner}
      />
      <div className="px-5 lg:px-16 2xl:px-32 py-12 pb-20 grid gap-4 grid-cols-2">
        <ProjectInfo
          projectName={data?.projectName}
          bannerImageUrl={data?.projectInfoBanner}
          discordUrl={data?.discordUrl}
          twitterUrl={data?.twitterUrl}
          openseaUrl={data?.openseaUrl}
          price={data?.ethPrice}
          supply={data?.totalSupply}
        />
        <MintSection />
      </div>
    </>
  )
}

export default HomePage
