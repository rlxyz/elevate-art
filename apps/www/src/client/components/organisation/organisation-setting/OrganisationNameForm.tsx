import SettingLayout from '@components/layout/settings'
import { useMutateOrganisationUpdateName } from '@hooks/trpc/organisation/useMutateOrganisationUpdateName'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const OrganisationNameForm = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { mutate, isLoading } = useMutateOrganisationUpdateName()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: organisation?.name,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!organisation) return
        if (data.name !== undefined) {
          mutate({
            organisationId: organisation.id,
            name: data.name,
          })
        }
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Team Name' description='Used to identify your Teams name on elevate.art' />
      <SettingLayout.Body>
        <div className='w-fit rounded-[5px] border border-mediumGrey'>
          <div className='h-full grid grid-cols-10 text-sm'>
            <div className='col-span-4 border-r border-r-mediumGrey rounded-l-[5px] bg-lightGray text-darkGrey flex items-center'>
              <span className='px-4 py-2 text-xs'>{`${'elevate.art'}/`}</span>
            </div>
            <div className='col-span-6 flex items-center'>
              <input
                className={clsx(
                  'text-xs p-2 w-full h-full rounded-r-[5px]', //! @note this input doesn't have border
                  'invalid:border-redError invalid:text-redError',
                  'focus:invalid:border-redError focus:invalid:ring-redError',
                  'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight',
                  'disabled:cursor-not-allowed disabled:opacity-60 disabled:ring-none disabled:border-none'
                )}
                disabled={false}
                aria-invalid={errors.name ? 'true' : 'false'}
                defaultValue={organisation?.name}
                {...register('name', {
                  required: true,
                  maxLength: 25,
                  minLength: 3,
                  pattern: /^[a-zA-Z0-9-]+$/,
                  validate: (value) => {
                    if (value === organisation?.name) {
                      return 'You supplied the same Team name'
                    }
                    if (value === 'elevate') {
                      return 'This Team name is reserved'
                    }
                    if (value === 'elevate.art') {
                      return 'This Team name is reserved'
                    }
                    if (value === 'elevateart') {
                      return 'This Team name is reserved'
                    }
                    if (value === '') {
                      return 'Please enter a valid Team name'
                    }

                    // return 'As of right now, we are not allowing renaming of Teams.'
                  },
                })}
              />
            </div>
          </div>
        </div>
        {errors.name ? (
          <SettingLayout.Error
            message={
              String(errors?.name?.message)
                ? String(errors.name.message)
                : errors?.name.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.name.type === 'maxLength' || errors?.name.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid project name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
