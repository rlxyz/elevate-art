import * as z from "zod";

export const OrganisationDatabaseRoleEnum = z.nativeEnum(
  Object.freeze({
    Admin: "admin",
    Curator: "curator",
  })
);
export type OrganisationDatabaseRoleEnumType = z.infer<
  typeof OrganisationDatabaseRoleEnum
>;

export const OrganisationDatabaseEnum = z.nativeEnum(
  Object.freeze({
    Personal: "personal",
    Team: "team",
  })
);
export type OrganisationDatabaseType = z.infer<typeof OrganisationDatabaseEnum>;

export const CollectionDatabaseEnum = z.nativeEnum(
  Object.freeze({
    Default: "default",
    Development: "development",
  })
);
export type CollectionDatabaseType = z.infer<typeof CollectionDatabaseEnum>;
