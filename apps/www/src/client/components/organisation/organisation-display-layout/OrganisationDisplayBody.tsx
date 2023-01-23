import type { Organisation, Repository } from '@prisma/client'
import { OrganisationDisplayBodyFound } from './OrganisationDisplayBodyFound'
import { OrganisationDisplayBodyNotFound } from './OrganisationDisplayBodyNotFound'

export const OrganisationDisplayBody = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <div className='space-y-6'>
      {organisation && repositories && (
        <>
          {repositories.length > 0 ? (
            <OrganisationDisplayBodyFound organisation={organisation} repositories={repositories} />
          ) : (
            <OrganisationDisplayBodyNotFound />
          )}
        </>
      )}
    </div>
  )
}
