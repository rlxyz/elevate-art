import { HeaderInternalPageRoutes } from "@components/layout/core/Header";
import { Layout } from "@components/layout/core/Layout";
import { OrganisationAuthLayout } from "@components/organisation/OrganisationAuthLayout";
import { RulesDisplay } from "@components/repository/RulesDisplay";
import { RulesSelector } from "@components/repository/RulesSelector";
import withOrganisationStore from "@components/withOrganisationStore";
import useRepositoryStore from "@hooks/store/useRepositoryStore";
import { useQueryLayerElementFindAll } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { useQueryRepositoryFindByName } from "@hooks/trpc/repository/useQueryRepositoryFindByName";
import { useRepositoryRoute } from "@hooks/utils/useRepositoryRoute";
import { CollectionNavigationEnum } from "@utils/enums";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

const Page = () => {
  const router: NextRouter = useRouter();
  const organisationName: string = router.query.organisation as string;
  const repositoryName: string = router.query.repository as string;
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll();
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName();
  const { all: organisations } = useQueryOrganisationFindAll();
  const { mainRepositoryHref } = useRepositoryRoute();
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId);

  useEffect(() => {
    if (!repository) return;
    setRepositoryId(repository.id);
  }, [isLoadingRepository]);

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: `/${mainRepositoryHref}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
                enabled: true,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border="lower">
          <div className="w-full py-16">
            <div className="flex justify-center">
              <div className="w-full space-y-1">
                <span className="text-xs font-semibold uppercase">Create a condition</span>
                <RulesSelector layers={layers} />
              </div>
            </div>
          </div>
          <div className="w-full py-16">
            <div className="flex w-full flex-col justify-center space-y-3">
              <span className="text-xs font-semibold uppercase">All rules created</span>
              <RulesDisplay traitElements={layers.flatMap((x) => x.traitElements)} />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  );
};

export default withOrganisationStore(Page);
