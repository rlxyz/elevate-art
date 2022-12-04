import NextLinkComponent from "@components/layout/link/NextLink";
import useOrganisationNavigationStore from "@hooks/store/useOrganisationNavigationStore";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useQueryOrganisationFindAll } from "src/hooks/trpc/organisation/useQueryOrganisationFindAll";
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from "src/utils/enums";
import { capitalize } from "src/utils/format";

export const SettingsNavigations = () => {
  const { current: organisation } = useQueryOrganisationFindAll();
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute);
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
        },
        {
          name: OrganisationSettingsNavigationEnum.enum.Team,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}/${OrganisationSettingsNavigationEnum.enum.Team}`,
        },
      ].map(({ name, href }) => {
        return (
          <NextLinkComponent
            key={name}
            href={href}
            block
            className={clsx(currentSettingsRoute === name && "font-semibold", "w-full text-xs")}
          >
            {capitalize(name)}
          </NextLinkComponent>
        );
      })}
    </div>
  );
};

export const OrganisationGeneralSettings = () => {
  const { current: organisation } = useQueryOrganisationFindAll();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        // @todo to be implemented
      })}
    >
      <div className="w-full rounded-[5px] border border-border">
        <div className="space-y-4 p-6">
          <div className="flex flex-col">
            <div className="col-span-6 space-y-2 font-plus-jakarta-sans">
              <h1 className="text-lg font-semibold text-foreground">Team Name</h1>
              <p className="text-xs text-foreground">{"Used to identify your teams name on elevate.art"}</p>
            </div>
          </div>
          <div className="w-full rounded-[5px] border border-border">
            <div className="grid h-full grid-cols-10 text-sm">
              <div className="col-span-4 flex items-center rounded-l-[5px] border-r border-r-accents_7 bg-accents_8 text-accents_5">
                <span className="px-4 py-2">{`elevate.art/`}</span>
              </div>
              <div className="col-span-6 flex items-center">
                {/* <input
                  className='text-xs px-2 w-full h-full rounded-[5px]'
                  defaultValue={organisation?.name || ''}
                  type='string'
                  {...register('name', { required: true, maxLength: 20, minLength: 3, pattern: /^[-/a-z0-9]+$/gi })}
                /> */}
                <span className="flex h-full w-full items-center rounded-[5px] px-2 text-xs">{organisation?.name}</span>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex h-[3rem] w-full items-center justify-end border-t border-t-accents_7 bg-accents_8 p-6 text-xs">
          {/* <div className='flex items-center'>
            <span>{`Learn more about`}&nbsp;</span>
            <Link href='https://docs.elevate.art/team'>
            <div className='flex items-center text-success'>
              <span>{'Team Name'}</span>
              <ArrowTopRightOnSquare className='w-3 h-3' />
            </div>
            </Link>
          </div> */}
          <div>
            <div className="rounded-[5px] border border-border px-4 py-2">
              <span className="text-accents_5">Save</span>
            </div>
          </div>
        </footer>
      </div>
    </form>
  );
};
