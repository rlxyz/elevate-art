import { Popover, Transition } from '@headlessui/react'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { useMutateRepositoryLayersWeight } from '@hooks/mutations/useMutateRepositoryLayersWeight'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { calculateTraitQuantityInCollection } from '@utils/math'
import clsx from 'clsx'
import { Form, Formik } from 'formik'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'

const calculateSumArray = (values: { id: string; weight: number }[]) => {
  return values.reduce((a, b) => a + Number(b.weight), 0) // change to number incase someone accidently changes how textbox works
}

const LayerRarityTable = ({ traitElements }: { traitElements: TraitElement[] | undefined }) => {
  const cld = createCloudinary()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const { current: collection } = useQueryRepositoryCollection()
  const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })
  const { current: layer } = useQueryRepositoryLayer()

  if (!layer || !traitElements) return null
  const { id: layerId, traitElements: nonFilteredTraitElements } = layer
  const summedRarityWeightage = calculateSumArray(nonFilteredTraitElements)

  return (
    <>
      {!summedRarityWeightage || !collection ? null : (
        <Formik
          enableReinitialize
          initialValues={{
            traits: traitElements.map((traitElement: TraitElement) => {
              return {
                id: traitElement.id,
                weight: Number(
                  calculateTraitQuantityInCollection(traitElement.weight, summedRarityWeightage, collection.totalSupply)
                ),
              }
            }),
          }}
          onSubmit={(values) => {
            mutate({
              repositoryId,
              layerId,
              traits: values.traits.map(({ id, weight }: { id: string; weight: number }) => {
                return {
                  id,
                  weight: (weight / calculateSumArray(values.traits)) * 100,
                }
              }),
            })
          }}
        >
          {({ values, handleChange, initialValues, handleSubmit, isSubmitting, resetForm }) => (
            <>
              <div className='flex flex-col'>
                <div className='inline-block min-w-full align-middle'>
                  <Form onSubmit={handleSubmit} className='overflow-hidden'>
                    <table className='border-separate border-spacing-x-0 border-spacing-y-0 min-w-full'>
                      <thead className='bg-white'>
                        <tr>
                          <th className='border-t border-l rounded-tl-[5px] border-mediumGrey pl-3'>
                            <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                          </th>
                          {[
                            { title: '' },
                            { title: 'Name' },
                            {
                              title: 'Estimate in Collection',
                              description: 'We linearly distribute the rarity changes to the rest of the traits in this layer.',
                            },

                            {
                              title: 'Rarity Score',
                              description:
                                'This is the rarity score of each trait in this layer. It is based on the OpenRarity standard.',
                            },

                            { title: '%' },
                          ].map(({ title, description }, index) => {
                            return (
                              <th key={title} scope='col' className={clsx('text-left border-t border-mediumGrey py-2')}>
                                <div className='flex items-center space-x-1'>
                                  <span className='text-[0.65rem] uppercase font-normal text-darkGrey'>{title}</span>
                                  {hasFormChange && index == 2 && (
                                    <button
                                      className='flex'
                                      onClick={(e: any) => {
                                        e.preventDefault()
                                        handleSubmit()
                                      }}
                                    >
                                      <CheckCircleIcon className='text-blueHighlight w-4 h-4' />
                                    </button>
                                  )}
                                  {description && (
                                    <Popover>
                                      <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
                                      <Transition
                                        as={Fragment}
                                        enter='transition ease-out duration-200'
                                        enterFrom='opacity-0 translate-y-1'
                                        enterTo='opacity-100 translate-y-0'
                                        leave='transition ease-in duration-150'
                                        leaveFrom='opacity-100 translate-y-0'
                                        leaveTo='opacity-0 translate-y-1'
                                      >
                                        <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
                                          <div className='p-2 shadow-lg'>
                                            <p className='text-[0.65rem] text-white font-normal'>{description}</p>
                                          </div>
                                        </Popover.Panel>
                                      </Transition>
                                    </Popover>
                                  )}
                                </div>
                              </th>
                            )
                          })}
                          <th className='pr-3 border-t border-r rounded-tr-[5px] border-mediumGrey'>
                            {/* <div className='relative'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-4 h-4 text-darkGrey'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                                />
                              </svg>
                              <span className='absolute left-[-20px] top-[-2.5px] px-2 bg-blueHighlight text-white inline-flex items-center rounded-full border border-mediumGrey text-[0.65rem] font-medium'>
                                1
                              </span>
                            </div> */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-mediumGrey'>
                        {traitElements.map(({ name, id, layerElementId }: TraitElement, index: number) => (
                          <tr key={index}>
                            <th
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b rounded-bl-[5px]',
                                'pl-3 border-l border-t border-mediumGrey'
                              )}
                            >
                              <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                            </th>
                            <td
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b',
                                'py-3  border-t border-mediumGrey'
                              )}
                            >
                              <div className='relative h-8 w-8 border border-mediumGrey rounded-[5px]'>
                                <Image
                                  src={cld
                                    .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}/${id}.png`)
                                    .toURL()}
                                  layout='fill'
                                  className='rounded-[5px]'
                                />
                              </div>
                            </td>
                            <td
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b',
                                'border-t border-mediumGrey whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium w-[20%]'
                              )}
                            >
                              {name}
                            </td>
                            <td
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b',
                                'border-t border-mediumGrey whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'
                              )}
                            >
                              <div className='flex space-x-3 items-center justify-start'>
                                <div className='w-20'>
                                  <input
                                    className='bg-white text-xs w-full border border-mediumGrey rounded-[5px] p-2'
                                    id={`traits.${index}.weight`}
                                    type='number'
                                    name={`traits.${index}.weight`}
                                    min={0}
                                    max={collection.totalSupply}
                                    value={values.traits[index]?.weight}
                                    onChange={(e) => {
                                      e.persist()
                                      !hasFormChange && setHasFormChange(true)
                                      const trait = values.traits.find((x) => x.id === id)
                                      if (!trait) {
                                        resetForm()
                                        return
                                      }
                                      handleChange(e)
                                      // if (Number(e.target.value) + calculateSumArray(values.traits) > collection.totalSupply) {
                                      //   return
                                      // }
                                      const difference = trait.weight - Number(e.target.value)
                                      const linearDistributeLength =
                                        values.traits.length - values.traits.filter((v) => v.weight === 0).length - 1
                                      values.traits = values.traits.map((t) => {
                                        if (t.weight === 0) return { ...t, weight: 0 }
                                        return {
                                          id: t.id,
                                          weight: t.weight + difference / linearDistributeLength,
                                        }
                                      })
                                    }}
                                  />
                                </div>
                                <span>out of {collection.totalSupply}</span>
                              </div>
                            </td>
                            <td
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b',
                                'border-t border-mediumGrey whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium items-center'
                              )}
                            >
                              {Number(
                                -Math.log((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)).toFixed(3)
                              ) % Infinity || 0}
                            </td>
                            <td
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b',
                                'border-t border-mediumGrey whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'
                              )}
                            >
                              {(((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)) * 100).toFixed(3)}%
                            </td>
                            <th
                              className={clsx(
                                index === traitElements.length - 1 && 'border-b rounded-br-[5px]',
                                'pr-3 border-t border-r border-mediumGrey'
                              )}
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-4 h-4 text-darkGrey'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                                />
                              </svg>
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Form>
                </div>
              </div>
              {/* {hasFormChange && (
                <motion.div
                  initial='hidden'
                  animate='show'
                  variants={{
                    hidden: {
                      opacity: 0,
                      transition: {
                        staggerChildren: 0.5,
                      },
                    },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.5,
                      },
                    },
                  }}
                  className='fixed bottom-0 h-[7.5%] 2xl:w-[calc(55vw)] 3xl:w-[calc(39vw)] lg:w-[calc(58vw)] md:w-[calc(70vw)] flex justify-end space-x-3 rounded-[5px] bg-hue-light border border-mediumGrey'
                >
                  <div className='flex items-center space-x-3'>
                    {calculateSumArray(values.traits) > calculateSumArray(initialValues.traits) && (
                      <>
                        <Image src='/images/tooltip.svg' height={15} width={15} />
                        <span className='text-redDot text-sm'>{`You've overallocated by ${
                          calculateSumArray(values.traits) - calculateSumArray(initialValues.traits)
                        }`}</span>
                      </>
                    )}

                    {calculateSumArray(initialValues.traits) > calculateSumArray(values.traits) && (
                      <>
                        <Image src='/images/tooltip.svg' height={15} width={15} />
                        <span className='text-redDot text-sm'>{`You've underallocated by ${
                          calculateSumArray(initialValues.traits) - calculateSumArray(values.traits)
                        }`}</span>
                      </>
                    )}

                    {calculateSumArray(initialValues.traits) === calculateSumArray(values.traits) && (
                      <>
                        <span className='text-blueHighlight text-sm'>You can now submit</span>
                      </>
                    )}
                  </div>
                  <div className='flex space-x-3 items-center px-6'>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={(e: any) => {
                        e.preventDefault()
                        resetForm()
                        setHasFormChange(false)
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant='primary'
                      disabled={
                        (calculateSumArray(values.traits) == calculateSumArray(initialValues.traits) ? false : true) ||
                        isSubmitting
                      }
                      onClick={(e: any) => {
                        e.preventDefault()
                        handleSubmit()
                      }}
                    >
                      <span className='flex items-center justify-center space-x-2 px-4 py-4'>
                        <span className='text-xs'>Confirm</span>
                      </span>
                    </Button>
                  </div>
                </motion.div>
              )} */}
            </>
          )}
        </Formik>
      )}
    </>
  )
}

export default LayerRarityTable
