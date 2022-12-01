import { useQueryCollectionFindAll } from "@hooks/trpc/collection/useQueryCollectionFindAll";
import { NextRouter, useRouter } from "next/rosrc/hooks/trpc/repository/useQueryRepositoryFindByName";
import { useEffect } from "react";
import useRepositoryStore from "src/client/hooks/store/useRepositoryStore";
import CollectionBranchSelectorCard from "src/components/collection/CollectionBranchSelectorCard";
import { GenerateButton } from "src/components/collection/CollectionGenerateCard";
import CollectionPreviewFilters from "src/components/collection/CollectionPreviewFilters";
import CollectionPreviewGrid from "src/components/collection/CollectionPreviewGrid";
import { HeaderInternalPageRoutes } from "src/components/layout/core/Header";
import { Layout } from "src/components/layout/core/Layout";
import { OrganisationAuthLayout } from "src/components/organisation/OrganisationAuthLayout";
import { useQueryOrganisationFindAll } from "src/hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { CollectionNavigationEnum } from "src/shared/enums";
import { useRepositoryRoute } from "../../../hooks/utils/useRepositoryRoute";
import { useQueryLayerElementFindAll } from fromsrc / hooks / trpc / collection / useQueryCollectionFindAllindAll;
import { useQueryRepositoryFindByName } from src / hooks / trpc / organisation / useQueryOrganisationFindAll;
";
";
import withOrganisationStore frosrc/hooks/store/useRepositoryStore

const Page = () => {
  const { setCollectionId, reset, setRepositoryId } = useRepositoryStore(
    (state) => {
      return {
        setRepositoryId: state.setRepositoryId,
        setCollectionId: state.setCollectionId,
        reset: state.reset,
      };
    },
  );

  useEffect(() => {
    reset();
  }, []);

  const router: NextRouter = useRouter();
  const organisationName: string = router.query.organisation as string;
  const repositoryName: string = router.query.repository as string;
  const { current: layer, isLoading: isLoadingLayers } =
    useQueryLayerElementFindAll();
  const {
    all: collections,
    isLoading: isLoadingCollection,
    mutate,
  } = useQueryCollectionFindAll();
  const { current: repository, isLoading: isLoadingRepository } =
    useQueryRepositoryFindByName();
  const { all: organisations } = useQueryOrganisationFindAll();
  const { mainRepositoryHref } = useRepositoryRoute();
  const { collectionName } = useRepositoryRoute();

  useEffect(() => {
    if (!repository) return;
    setRepositoryId(repository.id);
  }, [isLoadingRepository]);

  useEffect(() => {
    if (!collections) return;
    if (!collections.length) return;
    const collection = collections.find(
      (collection) => collection.name === collectionName,
    );
    if (!collection) return;
    setCollectionId(collection.id);
    // if (tokens.length === 0) return
    mutate({ collection });
  }, [isLoadingCollection]);

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: organisationName,
              href: `/${organisationName}`,
              organisations,
            },
            {
              current: repositoryName,
              href: `/${organisationName}/${repositoryName}`,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: `/${mainRepositoryHref}`,
                enabled: true,
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
                enabled: false,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border="none">
          <div className="grid h-full w-full grid-flow-row-dense grid-cols-10 grid-rows-1">
            <div className="col-span-2 py-8">
              <div>
                <div className="relative flex flex-col justify-between space-y-3">
                  <div className="grid h-full w-full grid-cols-8 gap-x-2">
                    <div className="col-span-6">
                      <CollectionBranchSelectorCard />
                    </div>
                    <div className="col-span-2">
                      <GenerateButton />
                    </div>
                  </div>
                  <CollectionPreviewFilters />
                </div>
              </div>
            </div>
            <div className="col-span-8">
              <main className="space-y-6 py-8 pl-8">
                <CollectionPreviewGrid />
              </main>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  );
};

export default withOrganisationStore(Page);
