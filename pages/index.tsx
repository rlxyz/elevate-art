import { config } from '@utils/config'
import dynamic from 'next/dynamic'

const ProjectInfo = dynamic(
  () => import('@components/Minter/ProjectInfo').then(mod => mod.ProjectInfo),
  { ssr: false },
)

export const HomePage = () => {
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
      </div>
    </div>
  )
}

export default HomePage
