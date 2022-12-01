import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import type { NextPage } from "next";
import useOrganisationNavigationStore from "src/client/hooks/store/useOrganisationNavigationStore";
import { HeaderInternalPageRoutes } from "src/components/layout/core/Header";
import { Layout } from "src/components/layout/core/Layout";
import ViewAllRepositories from "src/components/organisation/OrganisationViewAllRepository";
import withOrganisationStore from "src/composrc/hooks/store/useOrganisationNavigationStore";
import { OrganisationNavigationEnum } from "src/shared/enums";
import { OrganisationAuthLayout } from "../../components/organisation/OrganisationAuthLayout";
src / hooks / trpc / organisation / useQueryOrganisationFindAll;

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute);
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll();

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Overview}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: organisation?.name || "",
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `/${organisation?.name}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Overview,
                loading: isLoadingOrganisations,
              },
              {
                name: OrganisationNavigationEnum.enum.Settings,
                href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                loading: isLoadingOrganisations,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <div className="space-y-8 py-8">
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  );
};

export default withOrganisationStore(Page);
