import { MintSection } from '@components/Minter/MintSection'
import { config } from '@utils/config'
import LogRocket from 'logrocket'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

const ProjectInfo = dynamic(
  () => import('@components/Minter/ProjectInfo').then(mod => mod.ProjectInfo),
  { ssr: false },
)

export const HomePage = () => {
  const account = useAccount()

  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <div>
        <img
          src={config.projectBannerImage}
          alt={config.projectName}
          className="w-full"
        />
      </div>
      <div className="w-full p-8">
        <ProjectInfo />
        <MintSection />
      </div>
    </div>
  )
}

export default HomePage
