import SearchComponent from '@components/layout/search/Search'
import type { Organisation, Repository } from '@prisma/client'
import { useState } from 'react'
import { RepositoryDisplayCard } from './RepositoryDisplayCard'

export const OrganisationDisplayBodyFound = ({
  organisation,
  repositories,
}: {
  organisation: Organisation
  repositories: Repository[]
}) => {
  const [query, setQuery] = useState('')
  const filteredRepositories = repositories?.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <SearchComponent
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      <div className='grid grid-cols-3 3xl:grid-cols-4 gap-6'>
        {filteredRepositories?.map((r) => (
          <RepositoryDisplayCard key={r.name} repository={r} organisationName={organisation?.name} />
        ))}
      </div>
    </>
  )
}
