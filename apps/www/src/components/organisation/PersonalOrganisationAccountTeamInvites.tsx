import { useSession } from "next-auth/react";
import { useQueryOrganisationFindAll } from "src/hooks/trpc/organisation/useQueryOrganisationFindAll";
import { capitalize } from "src/utils/format";
import { PersonalOrganisationTeamInvitesAcceptDialog } from "./PersonalOrganisationTeamInvitesAcceptDialog";

export const PersonalOrganisationAccountTeamInvites = () => {
  const { pendings } = useQueryOrganisationFindAll();
  const session = useSession();
  return (
    <>
      {pendings?.length ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xl font-semibold">
              <span>Pending Invites</span>
            </span>
            <div className={"text-xs text-accents_5"}>
              <p>Join teams youve been invited to</p>
            </div>
          </div>
          <div className="divide-y divide-accents_7 rounded-[5px] border border-border">
            {pendings.map((pending) => {
              return (
                <div key={pending.id} className="flex flex-row items-center justify-between p-4">
                  <div className="flex flex-row items-center space-y-1 space-x-3">
                    <div className="h-6 w-6 rounded-full border border-border bg-success" />
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-bold">{pending.organisation.name}</span>
                      <span className="text-xs text-accents_5">{capitalize(pending.role)}</span>
                    </div>
                  </div>
                  <div className="flex flex-row space-x-2">
                    {session?.data?.user?.address ? <PersonalOrganisationTeamInvitesAcceptDialog pending={pending} /> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};
