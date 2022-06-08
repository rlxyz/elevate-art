import { Button } from '@components/Button'
import { Disconnected } from '@components/Minter/Disconnected'
import { MintRequirements } from '@components/Minter/MintRequirements'
import { config } from '@utils/config'
import dynamic from 'next/dynamic'
import { useConnect } from 'wagmi'

const ProjectInfo = dynamic(
  () => import('@components/Minter/ProjectInfo').then(mod => mod.ProjectInfo),
  { ssr: false },
)

export const HomePage = () => {
  const { isConnected } = useConnect()
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
        {isConnected ? <MintRequirements /> : <Disconnected />}
        <div className="mt-6">
          <Button disabled>Mint 10 NFTs</Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
