import SearchComponent from '@components/layout/search/Search'
import type { Organisation, Repository } from '@prisma/client'
import { useState } from 'react'
import { RepositoryDisplayCard } from './RepositoryDisplayCard'

export const OrganisationDisplayBody = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  const [query, setQuery] = useState('')
  const filteredRepositories = repositories?.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className='space-y-6'>
      <span className='font-semibold'>{organisation?.name}&apos;s Collections</span>
      <SearchComponent
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      <div className='grid grid-cols-3 gap-6'>
        {filteredRepositories?.map((r) => (
          <RepositoryDisplayCard key={r.name} repository={r} />
        ))}
      </div>
    </div>
  )
}
