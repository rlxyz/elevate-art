import { Avatar, Search, useInput } from "@elevateart/ui";
import { ChevronRightIcon, CubeIcon, DocumentDuplicateIcon, UserIcon } from "@heroicons/react/outline";
import useRepositoryStore from "@hooks/store/useRepositoryStore";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { useQueryOrganisationFindAllRepository } from "@hooks/trpc/organisation/useQueryOrganisationFindAllRepository";
import clsx from "clsx";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { timeAgo } from "src/utils/time";

const NoRepositoryExistPlaceholder = () => {
  const { current } = useQueryOrganisationFindAll();
  return (
    <div className="flex h-full min-h-[calc(100vh-14rem)] w-full flex-col items-center justify-center">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-[50%]">
            <img className="h-full object-cover" src="/images/logo-banner.png" alt="elevate art logo" />
          </div>
          <span className="text-md">
            We created a team for you called <span className="font-bold text-success">{current?.name}</span>
          </span>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <Link className="space-x-1 px-6" href={`${current?.name}/new`}>
            <div className="flex items-center justify-center rounded-[5px] border border-border bg-foreground p-3">
              <span className="text-sm text-accents_8">Create a Project</span>
              <ChevronRightIcon className="h-4 w-4 text-accents_8" />
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <span className="text-xs">
            <Link href="https://docs.elevate.art" rel="noreferrer nofollow" target="_blank">
              <span className="font-semibold text-success">Learn</span>
            </Link>{" "}
            about elevate.art
          </span>
        </div>
      </div>
    </div>
  );
};

const ViewAllRepositories = () => {
  const router: NextRouter = useRouter();
  const organisationName: string = router.query.organisation as string;
  const { bindings: inputBindings, state: input } = useInput("");
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationFindAllRepository();
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId);
  if (repositories && repositories.length === 0) return <NoRepositoryExistPlaceholder />;
  const isLoading = !repositories;
  const filteredRepositories =
    input === ""
      ? repositories
      : repositories?.filter((repo) => {
          return repo.name.toLowerCase().includes(input.toLowerCase());
        });

  return (
    <>
      <div className="grid grid-cols-10 items-center space-x-3">
        <div className="col-span-9 h-full w-full">
          <Search isLoading={isLoading} {...inputBindings} />
        </div>
        <div className="col-span-1 flex h-full items-center">
          <div className={clsx(isLoading && "animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50", "h-full w-full")}>
            <button
              className={clsx(isLoading && "invisible", "text-white bg-black h-full w-full rounded-[5px] border text-xs font-semibold")}
              onClick={(e: any) => {
                e.preventDefault();
                router.push(`${organisationName}/new`);
              }}
            >
              Add New
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-6">
        {!repositories ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div className={clsx(isLoading && "animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50", "col-span-1 w-full")} key={index}>
                <div className={clsx(isLoading && "invisible", "space-y-4 rounded-[5px] px-6 py-5")}>
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-full bg-success" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{"no_collection"}</span>
                      <span className="text-xs text-accents_5">Last Edited {"0 days ago"}</span>
                    </div>
                  </div>
                  <div className="flow-root">
                    <ul role="list">
                      {[
                        {
                          id: 1,
                          content: "Collections",
                          target: 0,
                          icon: UserIcon,
                        },
                        {
                          id: 2,
                          content: "Layers",
                          target: 0,
                          icon: CubeIcon,
                        },
                        {
                          id: 3,
                          content: "Traits",
                          target: 0,
                          icon: DocumentDuplicateIcon,
                        },
                      ].map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className={clsx("relative ml-2", eventIdx !== 2 && "pb-6")}>
                            {eventIdx !== 2 ? (
                              <span className="absolute top-6 left-1.5 -ml-px h-1/2 w-[1px] bg-foreground" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex items-center space-x-5">
                              <div>
                                <span className={"ring-white flex h-3 w-3 items-center justify-center rounded-full ring-8"}>
                                  <event.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 items-center justify-between space-x-4">
                                <p className="text-xs text-foreground">{event.content}</p>
                                <div className="whitespace-nowrap text-right text-xs text-foreground">{event.target}</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
        {filteredRepositories?.map((repository, index) => {
          return (
            <div className="col-span-1 w-full" key={index} onClick={() => setRepositoryId(repository.id)}>
              <Link href={`/${organisationName}/${repository.name}`}>
                <div className="w-full space-y-4 rounded-[5px] border border-border px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <Avatar src="images/avatar-blank.png" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{repository.name}</span>
                      <span className="text-xs text-accents_5">Last Edited {timeAgo(repository.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flow-root">
                    <ul role="list">
                      {[
                        {
                          id: 1,
                          content: "Collections",
                          target: repository._count.collections,
                          icon: UserIcon,
                        },
                        {
                          id: 2,
                          content: "Layers",
                          target: repository._count.layers,
                          icon: CubeIcon,
                        },
                        {
                          id: 3,
                          content: "Traits",
                          target: repository.layers.reduce((a, b) => {
                            return a + b._count.traitElements;
                          }, 0),
                          icon: DocumentDuplicateIcon,
                        },
                      ].map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className={clsx("relative ml-2", eventIdx !== 2 && "pb-6")}>
                            {eventIdx !== 2 ? (
                              <span className="absolute top-6 left-1.5 -ml-px h-1/2 w-[1px] bg-foreground" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex items-center space-x-5">
                              <div>
                                <span className={"flex h-3 w-3 items-center justify-center rounded-full ring-8 ring-background"}>
                                  <event.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 items-center justify-between space-x-4">
                                <p className="text-xs text-foreground">{event.content}</p>
                                <div className="whitespace-nowrap text-right text-xs text-foreground">
                                  {/* <time dateTime={event.datetime}>{event.date}</time> */}
                                  {event.target}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* <div className='ml-4 space-y-2'>
                    <div className='text-sm'>{repository._count.collections} collections</div>
                    <div className='text-sm'>{repository._count.layers} layers</div>
                    <div className='text-sm'>
                      {repository.layers.reduce((a, b) => {
                        return a + b._count.traitElements
                      }, 0)}{' '}
                      traits
                    </div>
                  </div> */}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ViewAllRepositories;
