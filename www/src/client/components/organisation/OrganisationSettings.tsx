import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from '@utils/enums'
import { capitalize } from '@utils/format'
import { useForm } from 'react-hook-form'
import { Link } from 'src/client/components/layout/Link'
import { useQueryOrganisation } from 'src/client/hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'

export const SettingsNavigations = () => {
  const { current: organisation } = useQueryOrganisation()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
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
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}

export const OrganisationGeneralSettings = () => {
  const { current: organisation } = useQueryOrganisation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <form
      onSubmit={handleSubmit((data) => {
        // @todo to be implemented
      })}
    >
      <div className='w-full rounded-[5px] border border-mediumGrey'>
        <div className='p-6 space-y-4'>
          <div className='flex flex-col'>
            <div className='col-span-6 font-plus-jakarta-sans space-y-2'>
              <h1 className='text-lg font-semibold text-black'>Team Name</h1>
              <p className='text-xs text-black'>{'Used to identify your teams name on elevate.art'}</p>
            </div>
          </div>
          <div className='w-full border border-mediumGrey rounded-[5px]'>
            <div className='h-full grid grid-cols-10 text-sm'>
              <div className='col-span-4 border-r border-r-mediumGrey rounded-l-[5px] bg-lightGray text-darkGrey flex items-center'>
                <span className='px-4 py-2'>{`elevate.art/`}</span>
              </div>
              <div className='col-span-6 flex items-center'>
                {/* <input
                  className='text-xs px-2 w-full h-full rounded-[5px]'
                  defaultValue={organisation?.name || ''}
                  type='string'
                  {...register('name', { required: true, maxLength: 20, minLength: 3, pattern: /^[-/a-z0-9]+$/gi })}
                /> */}
                <span className='text-xs px-2 w-full h-full items-center flex rounded-[5px]'>{organisation?.name}</span>
              </div>
            </div>
          </div>
        </div>
        <footer className='w-full p-6 flex items-center h-[3rem] bg-lightGray text-xs justify-end border-t border-t-mediumGrey'>
          {/* <div className='flex items-center'>
            <span>{`Learn more about`}&nbsp;</span>
            <Link href='https://docs.elevate.art/team'>
            <div className='flex items-center text-blueHighlight'>
              <span>{'Team Name'}</span>
              <ArrowTopRightOnSquare className='w-3 h-3' />
            </div>
            </Link>
          </div> */}
          <div>
            <div className='border border-mediumGrey px-4 py-2 rounded-[5px]'>
              <span className='text-darkGrey'>Save</span>
            </div>
          </div>
        </footer>
      </div>
    </form>
  )
}
