import { Layout } from "@components/layout/core/Layout";
import Upload from "@components/layout/upload";
import { OrganisationAuthLayout } from "@components/organisation/OrganisationAuthLayout";
import withOrganisationStore from "@components/withOrganisationStore";
import { Repository } from "@elevateart/db";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { useMutateRepositoryCreate } from "@hooks/trpc/repository/useMutateRepositoryCreate";
import { OrganisationNavigationEnum } from "@utils/enums";
import clsx from "clsx";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll();
  const router = useRouter();
  const [repository, setRepository] = useState<null | Repository>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const { mutate: createRepository } = useMutateRepositoryCreate({
    setRepository,
  });
  const isLoading = !organisation;
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
      <Layout hasFooter={false}>
        <Layout.Header
          internalRoutes={[
            {
              current: organisation?.name || "",
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        />
        <Layout.Body>
          <div className="absolute left-0 w-full p-12">
            {(uploadState === "uploading" || uploadState === "done") && (
              <div className="flex w-full items-end justify-between pb-3">
                <span className="text-lg font-bold">Layers</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/${organisation?.name}/${repository?.name}`);
                  }}
                  type="button"
                  disabled={uploadState !== "done"}
                  className="border-mediumGrey bg-black text-white disabled:bg-mediumGrey disabled:text-white rounded-[5px] border p-2 text-xs disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}
            <Upload
              className="h-[50vh]"
              depth={4}
              onDropCallback={createRepository}
              setUploadState={setUploadState}
              gridSize="lg"
              withTooltip={false}
            >
              <div className="flex h-[30vh] items-center">
                <div className="space-y-6">
                  <div className={clsx(isLoading && "bg-mediumGrey animate-pulse rounded-[5px]")}>
                    <span className={clsx(isLoading && "invisible", "text-5xl font-bold")}>Lets build something new.</span>
                  </div>
                  <div className={clsx(isLoading && "bg-mediumGrey animate-pulse rounded-[5px]")}>
                    <p className={clsx(isLoading && "invisible", "text-md")}>
                      To create a new Project, set the name and add layers, or get started with one of our templates.
                    </p>
                  </div>
                </div>
              </div>
            </Upload>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  );
};

export default withOrganisationStore(Page);
