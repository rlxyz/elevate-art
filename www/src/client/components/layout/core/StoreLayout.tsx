import { FC, ReactNode } from 'react'
import { createOrganisationNavigationStore, OrganisationRouterContext } from 'src/client/hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from 'src/client/hooks/store/useRepositoryStore'

export const StoreLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <OrganisationRouterContext.Provider createStore={() => createOrganisationNavigationStore}>
      <RepositoryContext.Provider createStore={() => createRepositoryStore}>{children}</RepositoryContext.Provider>
    </OrganisationRouterContext.Provider>
  )
}
