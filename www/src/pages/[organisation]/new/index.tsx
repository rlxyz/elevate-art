import CardComponent from '@components/layout/card/Card'
import { TriangleIcon } from '@components/layout/icons/TriangleIcon'
import NextLinkComponent from '@components/layout/link/NextLink'
import Upload from '@components/layout/upload'
import withOrganisationStore from '@components/withOrganisationStore'
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryOrganisationFindAllRepository } from '@hooks/trpc/organisation/useQueryOrganisationFindAllRepository'
import { useMutateRepositoryCreate } from '@hooks/trpc/repository/useMutateRepositoryCreate'
import { Organisation, Repository } from '@prisma/client'
import clsx from 'clsx'
import type { NextPage } from 'next'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { OrganisationNavigationEnum } from 'src/shared/enums'
import { z } from 'zod'

// create native zod enums steps
export const FormStepEnum = z.nativeEnum(
  Object.freeze({
    ConfigureProject: 'Configure Project',
    UploadLayers: 'Upload Layers',
    OrderLayer: 'Order Layer',
  })
)
export type FormStepEnumType = z.infer<typeof FormStepEnum>

export const FormSteps = ({ className, currentStep }: { className: string; currentStep: FormStepEnumType }) => (
  <div className={clsx(className)}>
    <div className='relative space-y-6'>
      <div className='absolute h-20 top-1 left-1 -translate-x-1/2 w-0.5 bg-mediumGrey' />
      {[FormStepEnum.enum.ConfigureProject, FormStepEnum.enum.UploadLayers, FormStepEnum.enum.OrderLayer].map((step) => (
        <div className='flex items-center space-x-6'>
          <div className={clsx('absolute w-2 h-2 rounded-full', currentStep === step ? 'bg-black' : 'bg-mediumGrey')} />
          <h2 className={clsx('text-xs text-darkGrey', currentStep == step && 'font-bold text-black')}>{step}</h2>
        </div>
      ))}
    </div>
  </div>
)

const GoBackButton = ({ organisation }: { organisation: Organisation }) => (
  <NextLinkComponent href={`/${organisation?.name}`}>
    <div className='flex flex-row items-center space-x-1'>
      <ArrowLeftIcon className='w-3 h-3 text-darkGrey' />
      <span className='text-sm text-darkGrey'>Go back</span>
    </div>
  </NextLinkComponent>
)

export const FormHeader = ({ title, description, children }: { title: string; description: string; children?: ReactNode }) => (
  <div className='pb-28 flex justify-between'>
    <div className='space-y-1'>
      <span className='text-3xl font-bold'>{title}</span>
      <p className='text-sm text-black'>{description}</p>
    </div>
    <div>{children}</div>
  </div>
)

export const FormLayout = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={className}>{children}</div>
}

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()
  const [repository, setRepository] = useState<null | Repository>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const { all: repositories } = useQueryOrganisationFindAllRepository()
  const [repositoryName, setRepositoryName] = useState<string | null>(null)
  const [currentStepPhase, setCurrentStepPhase] = useState<FormStepEnumType>(FormStepEnum.enum.ConfigureProject)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  })

  const { mutate: createRepository } = useMutateRepositoryCreate({ setRepository })

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
      <Layout hasFooter={false}>
        <Layout.Header
          border='none'
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        />
        <Layout.Body border='none'>
          <div className='py-20'>
            <GoBackButton organisation={organisation} />
            <FormHeader
              title="Let's create something new"
              description='Please follow the steps to configure your Project and upload your images.'
            />
            <FormLayout className='grid grid-cols-7 gap-12'>
              <FormSteps className='col-span-2 divide-y divide-mediumGrey space-y-12' currentStep={currentStepPhase} />
              <div className='col-span-5 space-y-12'>
                <CardComponent className='shadow-lg space-y-6 divide-y divide-mediumGrey'>
                  <h1 className='text-xl font-semibold'>Configure Project</h1>
                  <div className='space-y-3 py-6'>
                    <p className='text-xs text-darkGrey'>
                      To ensure you can easily update your layers and traits, we have to create the project for you first. Please enter a
                      name for your project. This name will be used to identify your project in the future.
                    </p>
                    {currentStepPhase === FormStepEnum.enum.ConfigureProject ? (
                      <form
                        onSubmit={handleSubmit((data) => {
                          setCurrentStepPhase(FormStepEnum.enum.UploadLayers)
                          setRepositoryName(data.name)
                        })}
                        className='pt-6 space-y-6'
                      >
                        <div className='flex space-y-1 flex-col'>
                          <label className='text-[0.6rem] uppercase'>Project Name</label>
                          <input
                            className={clsx(
                              'text-xs p-2 w-full h-full border border-mediumGrey rounded-[5px]',
                              'invalid:border-redError invalid:text-redError',
                              'focus:invalid:border-redError focus:invalid:ring-redError',
                              'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight'
                            )}
                            aria-invalid={errors.name ? 'true' : 'false'}
                            placeholder={"e.g 'fidenzas-v1'"}
                            {...register('name', {
                              required: true,
                              maxLength: 20,
                              minLength: 3,
                              pattern: /^[a-zA-Z0-9-]+$/,
                              validate: (value) => {
                                if (!repositories) return 'Please try resubmitting in a few seconds'
                                if (repositories.find((repo) => repo.name === value)) {
                                  return 'There is another project with this name in your team'
                                }
                              },
                            })}
                          />
                          {errors.name ? (
                            <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
                              <ExclamationCircleIcon className='text-redError w-4 h-4' />
                              <span>
                                {errors.name && (
                                  <span className='text-xs text-redError'>
                                    {errors.name.type === 'required'
                                      ? 'This field is required'
                                      : errors.name.type === 'pattern'
                                      ? 'We only accept - for special characters'
                                      : errors.name.type === 'validate'
                                      ? errors.name.message
                                      : 'Must be between 3 and 20 characters long'}
                                  </span>
                                )}
                              </span>
                            </span>
                          ) : null}
                        </div>
                        <button
                          type='submit'
                          className='w-full bg-blueHighlight py-2 rounded-[5px] text-white text-xs disabled:cursor-not-allowed disabled:bg-lightGray disabled:text-darkGrey'
                        >
                          Confirm
                        </button>
                      </form>
                    ) : (
                      <CardComponent className='bg-lightGray flex justify-between'>
                        <div className='flex space-x-3 items-center'>
                          <TriangleIcon className='w-4 h-4' />
                          <span className='text-xs font-semibold'>
                            {organisation?.name}/{getValues(`name`)}
                          </span>
                        </div>
                        <div className='text-xs flex space-x-1 text-blueHighlight'>
                          <span>Verified</span>
                          <CheckCircleIcon className='w-4 h-4' />
                        </div>
                      </CardComponent>
                    )}
                  </div>
                </CardComponent>

                <CardComponent
                  aria-disabled={currentStepPhase !== FormStepEnum.enum.UploadLayers}
                  className={clsx(
                    currentStepPhase === FormStepEnum.enum.UploadLayers || !repositoryName
                      ? ''
                      : 'cursor-not-allowed bg-lightGray/10 text-darkGrey',
                    'shadow-md p-6 divide-y divide-mediumGrey space-y-6'
                  )}
                >
                  <h1 className='text-xl font-semibold'>Upload Layers</h1>
                  <div className='space-y-3 py-6'>
                    <p className='text-xs text-darkGrey'>
                      To ensure that the layers and traits are uploaded correctly, ensure that the files are only use alphanumeral
                      characters. For special characters, we only support dashes ("-") and underscores ("_")
                    </p>
                    {organisation && repositoryName && (
                      <Upload
                        className='h-[40vh]'
                        depth={4}
                        organisation={organisation}
                        repository={repositoryName}
                        onDropCallback={createRepository}
                        setUploadState={setUploadState}
                        gridSize='lg'
                        withTooltip={false}
                      />
                    )}
                  </div>
                </CardComponent>
              </div>
            </FormLayout>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
