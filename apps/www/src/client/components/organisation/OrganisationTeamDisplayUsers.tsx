import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { OrganisationMember, User } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { useDeepCompareEffect } from "src/client/hooks/utils/useDeepCompareEffect";
import { getEnsName } from "src/client/utils/ethers";
import { capitalize } from "src/client/utils/format";
import { timeAgo } from "src/client/utils/time";

export const OrganisationTeamDisplayUsers = () => {
  const { current: organisation } = useQueryOrganisationFindAll();
  const [allMembers, setAllMembers] = useState<
    | {
        ens: string | null;
        id: string;
        userId: string;
        organisationId: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        user: User;
      }[]
    | undefined
  >(undefined);

  useDeepCompareEffect(() => {
    const resolveAddress = async () => {
      if (!organisation) return;
      return Promise.all(
        organisation.members.map(
          async (
            x: OrganisationMember & {
              user: User;
            },
          ) => {
            return {
              ...x,
              ens: await getEnsName(x.user.address),
            };
          },
        ),
      );
    };
    resolveAddress().then((pending) => {
      setAllMembers(pending);
    });
  }, [organisation]);

  return organisation && organisation.members.length > 0 ? (
    <div className="space-y-2">
      <span className="text-xs">Team Members</span>
      <div>
        <div className="flex h-[3rem] w-full items-center rounded-t-[5px] border border-border bg-accents_8 px-6 py-2 text-xs">
          <span className="text-accents_5">All</span>
        </div>
        <div className="divide-y divide-accents_7 rounded-b-[5px] border-x border-b border-border bg-background">
          {organisation.members.map(
            ({ id, user: { address }, createdAt, type }) => (
              <div
                key={id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-full border border-border bg-success" />
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs font-semibold">{address}</span>
                    <div className={clsx("flex items-baseline")}>
                      <span className="text-xs text-accents_5">
                        {createdAt && timeAgo(createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-accents_5">
                  {capitalize(type)}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
