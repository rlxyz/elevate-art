import AvatarComponent from "@components/layout/avatar/Avatar";
import SearchComponent from "@components/layout/search/Search";
import { Organisation, OrganisationMember, User } from "@elevateart/db";
import { OrganisationDatabaseEnum } from "@elevateart/db/enums";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { capitalize } from "src/utils/format";

export const PersonalOrganisationAccountTeam = () => {
  const { all: organisations } = useQueryOrganisationFindAll();
  const [query, setQuery] = useState("");
  const filteredOrganisaitons = organisations?.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()));
  const session = useSession();

  const getUserRoleInOrganisation = (organisation: Organisation & { members: (OrganisationMember & { user: User })[] }) => {
    return organisation.members.find((x) => x.userId === session?.data?.user?.id)?.type;
  };

  const isLoading = !organisations;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className={clsx(isLoading && "bg-mediumGrey animate-pulse rounded-[5px] bg-opacity-50", "text-xl font-semibold")}>
          <span className={clsx(isLoading && "invisible")}>Your Teams</span>
        </span>
        <div className={clsx(isLoading && "bg-mediumGrey w-1/4 animate-pulse rounded-[5px] bg-opacity-50", "text-darkGrey text-xs")}>
          <p className={clsx(isLoading && "invisible")}>View the Teams that youre a part of</p>
        </div>
      </div>
      <SearchComponent
        isLoading={isLoading}
        onChange={(e) => {
          e.preventDefault();
          setQuery(e.target.value);
        }}
      />
      {filteredOrganisaitons && filteredOrganisaitons?.length > 0 ? (
        <>
          <div className={clsx(organisations && "border-mediumGrey border", "divide-mediumGrey divide-y rounded-[5px]")}>
            {filteredOrganisaitons.map((organisation) => {
              return (
                <div key={organisation.id} className="flex flex-row items-center justify-between p-4">
                  <div className="flex flex-row items-center space-y-1 space-x-3">
                    <AvatarComponent src="images/avatar-blank.png" />
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-bold">
                        {organisation.type === OrganisationDatabaseEnum.enum.Personal ? capitalize(organisation.name) : organisation.name}
                      </span>
                      <span className="text-darkGrey text-xs">
                        {organisation.type === OrganisationDatabaseEnum.enum.Personal
                          ? capitalize(OrganisationDatabaseEnum.enum.Personal)
                          : capitalize(getUserRoleInOrganisation(organisation) || "")}
                      </span>
                    </div>
                  </div>
                  <Link href={`/${organisation.name}`} className="text-black border-mediumGrey rounded-[5px] border px-4 py-1.5 text-xs">
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
      {isLoading ? (
        <div className={clsx(organisations && "border-mediumGrey border", "divide-mediumGrey divide-y rounded-[5px]")}>
          {Array.from(Array(3).keys()).map((index) => {
            return (
              <div
                key={index}
                className={clsx(
                  isLoading && "bg-mediumGrey animate-pulse rounded-[5px] bg-opacity-50",
                  "flex flex-row items-center justify-between p-4",
                )}
              >
                <div className={clsx(!"invisible flex flex-row items-center space-y-1 space-x-3")}>
                  <div className="h-6 w-6 rounded-full" />
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs font-bold">{""}</span>
                    <span className="text-darkGrey text-xs">{""}</span>
                  </div>
                </div>
                <div />
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
