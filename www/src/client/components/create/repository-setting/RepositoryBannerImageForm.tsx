import SettingLayout from '@components/layout/settings'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryBannerImageForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { organisationName } = useRepositoryRoute()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: repository?.name,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        console.log(data)
      })}
    >
      <SettingLayout.Header
        title='Banner Image'
        description='A short description of your project. Note, this is also added to the metadata of the tokens in this collection'
      />
      <SettingLayout.Body>
        <div className='w-full rounded-[5px] border border-mediumGrey'>
          <div className='h-full grid grid-cols-10 text-sm'>
            <div className='col-span-4 border-r border-r-mediumGrey rounded-l-[5px] bg-lightGray text-darkGrey flex items-center'>
              <span className='px-4 py-2 text-xs'>{`${organisationName}/`}</span>
            </div>
            <div className='col-span-6 flex items-center'>
              <input
                className={clsx(
                  'text-xs p-2 w-full h-full rounded-r-[5px]', //! @note this input doesn't have border
                  'invalid:border-redError invalid:text-redError',
                  'focus:invalid:border-redError focus:invalid:ring-redError',
                  'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight'
                )}
                aria-invalid={errors.name ? 'true' : 'false'}
                placeholder={repository?.name}
                {...register('name', {
                  required: true,
                  maxLength: 25,
                  minLength: 3,
                  pattern: /^[a-zA-Z0-9-]+$/,
                  validate: (value) => {
                    if (value === repository?.name) {
                      return 'You supplied the same project name'
                    }

                    //! @note right now, this is disabled
                    return 'As of right now, we are not allowing renaming of projects.'
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
                ? 'Must be between 3 and 20 characters long'
                : 'Please enter a valid project name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
