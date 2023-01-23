import type { Organisation, Repository } from '@prisma/client'
import { OrganisationDisplayBody } from './OrganisationDisplayBody'
import { OrganisationDisplayHeader } from './OrganisationDisplayHeader'

export const OrganisationDisplayLayout = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <div className='py-8 space-y-16'>
      <OrganisationDisplayHeader organisation={organisation} />
      <OrganisationDisplayBody organisation={organisation} repositories={repositories} />
    </div>
  )
}
