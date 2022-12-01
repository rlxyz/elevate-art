import { OrganisationDatabaseEnum } from "@elevateart/db/enums";
import { OrganisationNavigationEnum } from "@utils/enums";
import { NextPage } from "next";
import { HeaderInternalPageRoutes } from "src/components/layout/core/Header";
import { Layout } from "src/components/layout/core/Layout";
import { OrganisationAuthLayout } from "src/components/organisation/OrganisationAuthLayout";
import { PersonalOrganisationAccountTeam } from "src/components/organisation/PersonalOrganisationAccountTeam";
import { PersonalOrganisationAccountTeamInvites } from "src/components/organisation/PersonalOrganisationAccountTeamInvites";
import withOrganisationStore from "src/components/withOrganisationStore";
import useOrganisationNavigationStore from "src/hooks/store/useOrganisationNavigationStore";
import { useQueryOrganisationFindAll } from "src/hooks/trpc/organisation/useQueryOrganisationFindAll";

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute);
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll();

  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal} route={OrganisationNavigationEnum.enum.Dashboard}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
              organisations,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                loading: isLoadingOrganisations,
              },
              {
                name: OrganisationNavigationEnum.enum.Account,
                href: `/${OrganisationNavigationEnum.enum.Account}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                loading: isLoadingOrganisations,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <div className="space-y-8 py-8">
            <div className="space-y-9">
              <PersonalOrganisationAccountTeam />
              <PersonalOrganisationAccountTeamInvites />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  );
};

export default withOrganisationStore(Page);
