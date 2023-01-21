import SettingLayout from '@components/layout/settings'
import { useMutateRepositoryUpdateWidth } from '@hooks/trpc/repository/useMutateRepositoryUpdateWidth'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'

export const RepositoryImageWidthForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { mutate, isLoading } = useMutateRepositoryUpdateWidth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      width: repository?.width,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!repository || !data.width) return
        mutate({
          repositoryId: repository?.id,
          width: Number(data.width),
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Image Width' description='Set the image width for the project' />
      <SettingLayout.Body>
        <div className='w-fit rounded-[5px] border border-mediumGrey'>
          <input
            className={clsx(
              'text-xs p-2 w-full h-full rounded-[5px]',
              'invalid:border-redError invalid:text-redError',
              'focus:invalid:border-redError focus:invalid:ring-redError',
              'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:ring-none disabled:border-none'
            )}
            aria-invalid={errors.width ? 'true' : 'false'}
            defaultValue={repository?.width}
            {...register('width', {
              required: true,
              valueAsNumber: true,
              maxLength: 25,
              minLength: 3,
              validate: (value) => {
                if (value === repository?.width) {
                  return 'You supplied the same width'
                }
              },
            })}
          />
        </div>
        {errors.width ? (
          <SettingLayout.Error
            message={
              String(errors?.width?.message)
                ? String(errors.width.message)
                : errors?.width.type === 'pattern'
                ? `We only accept "-" (dashes) as special characters`
                : errors?.width.type === 'maxLength' || errors?.width.type === 'minLength'
                ? 'Must be between 3 and 25 characters long'
                : 'Please enter a valid project name'
            }
          />
        ) : null}
      </SettingLayout.Body>
    </SettingLayout>
  )
}
