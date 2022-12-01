import { HeaderInternalPageRoutes } from "@components/layout/core/Header";
import { Layout } from "@components/layout/core/Layout";
import { OrganisationAuthLayout } from "@components/organisation/OrganisationAuthLayout";
import ViewAllRepositories from "@components/organisation/OrganisationViewAllRepository";
import withOrganisationStore from "@components/withOrganisationStore";
import useOrganisationNavigationStore from "@hooks/store/useOrganisationNavigationStore";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { OrganisationNavigationEnum } from "@utils/enums";
import { NextPage } from "next";

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
