import { AccountClipboardCopy } from './AccountClipboardCopy'
import { ProjectDetail } from './ProjectDetail'
import { SocialMediaLink } from './SocialMediaLink'

export const ProjectInfo = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:justify-between">
      <div className="flex">
        <ProjectDetail />
      </div>
      <div className="flex flex-col items-center lg:items-end">
        <AccountClipboardCopy />
        <SocialMediaLink />
      </div>
    </div>
  )
}
