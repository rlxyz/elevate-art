import LinkComponent from "@components/layout/link/Link";
import useOrganisationNavigationStore from "@hooks/store/useOrganisationNavigationStore";
import { useQueryOrganisationFindAll } from "@hooks/trpc/organisation/useQueryOrganisationFindAll";
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from "@utils/enums";
import { capitalize } from "src/utils/format";

export const PersonalOrganisationAccountNavigation = () => {
  const { current: organisation, isLoading } = useQueryOrganisationFindAll();
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute);
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${OrganisationNavigationEnum.enum.Account}`,
        },
      ].map(({ name, href }) => {
        // return <LinkComponent key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
        return <LinkComponent key={name} href={href} title={capitalize(name)} />;
      })}
    </div>
  );
};
