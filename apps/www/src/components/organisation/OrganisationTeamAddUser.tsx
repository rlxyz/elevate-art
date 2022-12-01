import { OrganisationDatabaseRoleEnum, OrganisationDatabaseRoleEnumType } from "@elevateart/db/enums";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import clsx from "clsx";
import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getAddressFromEns } from "src/utils/ethers";
import { capitalize } from "src/utils/format";
import { OrganisationTeamAddUserDialog } from "./OrganisationTeamAddUserDialog";

export const OrganisationTeamAddUser = () => {
  const { current: organisation } = useQueryOrganisationFindAll();
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [addNewUserData, setAddNewUserData] = useState<{ address: string; role: OrganisationDatabaseRoleEnumType } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return organisation ? (
    <form
      onSubmit={handleSubmit(async (data) => {
        let address: string | null;
        if (String(data.address).endsWith(".eth")) {
          address = await getAddressFromEns(data.address);
          if (!address) {
            setError("address", { type: "manual", message: "Address not found" });
            return;
          }
        } else {
          address = data.address;
        }

        if (!address) return;

        // validate address not in member or pending list
        const isMember = organisation.members.find((member) => member.user.address === address);
        if (isMember) {
          setError("address", { type: "manual", message: "Address already in member list" });
          return;
        }

        const isPendingMember = organisation.pendings.find((pending) => pending.address === address);
        if (isPendingMember) {
          setError("address", { type: "manual", message: "Address already in pending list" });
          return;
        }

        setIsOpen(true);
        setAddNewUserData({
          address,
          role:
            data.role === OrganisationDatabaseRoleEnum.enum.Admin
              ? OrganisationDatabaseRoleEnum.enum.Admin
              : OrganisationDatabaseRoleEnum.enum.Curator, // ensure typesafety
        });
      })}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-lg font-semibold text-foreground">Members</h1>
          <p className="text-xs text-foreground">Manage and invite Team Members.</p>
        </div>
        <div className="w-full rounded-[5px] border border-border">
          <div className="space-y-2 p-6">
            <div className="flex flex-col">
              <div className="col-span-6 space-y-3 divide-y divide-accents_7 font-plus-jakarta-sans">
                <h1 className="text-sm font-semibold text-foreground">Add new</h1>
                <p className="py-3 text-xs text-foreground">Add Team Members using Ethereum address or ENS.</p>
              </div>
            </div>
            <div className="grid h-full grid-cols-10 gap-x-2 text-sm">
              <div className="col-span-7 space-y-1">
                <label className="text-[0.7rem] uppercase">Ethereum Address</label>
                <div className="w-full">
                  <input
                    className={clsx(
                      "h-full w-full rounded-[5px] border border-border p-2 text-xs",
                      "invalid:border-error invalid:text-error",
                      "focus:invalid:border-error focus:invalid:ring-error",
                      "focus:border-success focus:outline-none focus:ring-1 focus:ring-success",
                    )}
                    aria-invalid={errors.address ? "true" : "false"}
                    placeholder="0xd2a420... or alpha.eth..."
                    {...register("address", {
                      required: true,
                      validate: async (v) => {
                        if (String(v).endsWith(".eth")) {
                          const address = await getAddressFromEns(v);
                          if (!address) return false;
                          return ethers.utils.isAddress(address);
                        }
                        return ethers.utils.isAddress(v);
                      },
                    })}
                  />
                </div>
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[0.7rem] uppercase">Role</label>
                <div className="w-full">
                  <select
                    {...register("role", { required: true })}
                    className="h-full w-full rounded-[5px] border border-border p-2 text-xs"
                  >
                    <option value={OrganisationDatabaseRoleEnum.enum.Admin}>{capitalize(OrganisationDatabaseRoleEnum.enum.Admin)}</option>
                    <option value={OrganisationDatabaseRoleEnum.enum.Curator}>
                      {capitalize(OrganisationDatabaseRoleEnum.enum.Curator)}
                    </option>
                  </select>
                </div>
              </div>
              {errors.address ? (
                <span className="col-span-10 mt-2 flex w-full items-center space-x-1 text-xs text-error">
                  <ExclamationCircleIcon className="h-4 w-4 text-error" />
                  <span>{String(errors?.address?.message) || "Please enter a valid Ethereum address"}</span>
                </span>
              ) : null}
              {errors.role ? (
                <span className="col-span-10 mt-2 flex w-full items-center space-x-1 text-xs text-error">
                  <ExclamationCircleIcon className="h-4 w-4 text-error" />
                  <span>Please choose a role for this address</span>
                </span>
              ) : null}
              {errors.exists ? (
                <>
                  <span className="col-span-10 mt-2 flex w-full items-center space-x-1 text-xs text-error">
                    <ExclamationCircleIcon className="h-4 w-4 text-error" />
                    <span>Something went wrong, possibly the address is already added</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex w-full items-center justify-end border-t border-t-accents_7 bg-accents_8  px-6 py-2 text-xs">
            <button className="rounded-[5px] border border-border bg-success px-4 py-1.5 text-accents_8 disabled:bg-accents_8 disabled:text-accents_5">
              Add
            </button>
            {addNewUserData && (
              <OrganisationTeamAddUserDialog
                organisationId={organisation.id}
                addNewUserData={addNewUserData}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  ) : (
    <></>
  );
};
