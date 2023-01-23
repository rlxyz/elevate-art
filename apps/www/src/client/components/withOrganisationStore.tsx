import type { NextPageContext } from 'next'
import type { FunctionComponent } from 'react'
import { createOrganisationNavigationStore, OrganisationRouterContext } from 'src/client/hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from 'src/client/hooks/store/useRepositoryStore'

const withOrganisationStore = (Component: FunctionComponent<any> & { getInitialProps?(context: NextPageContext): any | Promise<any> }) =>
  function AuthenticatedLayout(props: JSX.IntrinsicAttributes) {
    return (
      <OrganisationRouterContext.Provider createStore={() => createOrganisationNavigationStore}>
        <RepositoryContext.Provider createStore={() => createRepositoryStore}>
          <Component {...props} />
        </RepositoryContext.Provider>
      </OrganisationRouterContext.Provider>
    )
  }

export default withOrganisationStore
