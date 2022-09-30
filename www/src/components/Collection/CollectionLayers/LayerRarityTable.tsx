import Button from '@components/UI/Button'
import { Textbox } from '@components/UI/Textbox'
import { useMutateRepositoryLayersWeight } from '@hooks/mutations/useMutateRepositoryLayersWeight'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { useQueryCollection } from '@hooks/query/useQueryCollection'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { calculateTraitQuantityInCollection, calculateTraitRarityPercentage, calculateTraitRarityScore } from '@utils/math'
import clsx from 'clsx'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'

const calculateSumArray = (values: { id: string; weight: number }[]) => {
  return values.reduce((a, b) => a + Number(b.weight), 0) // change to number incase someone accidently changes how textbox works
}

const LayerRarityTable = () => {
  const cld = createCloudinary()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [summedRarityWeightage, setSummedRarityWeightage] = useState<number>(0)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const { data: collectionData } = useQueryCollection()
  const { currentLayer } = useCurrentLayer()
  const { traitElements, id: layerId } = currentLayer
  const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })

  useDeepCompareEffect(() => {
    setSummedRarityWeightage(calculateSumArray(traitElements))
  }, [traitElements])

  return (
    <>
      {!summedRarityWeightage || !collectionData ? null : (
        <Formik
          enableReinitialize
          initialValues={{
            traits: currentLayer.traitElements.map((traitElement: TraitElement) => {
              return {
                id: traitElement.id,
                weight: Number(
                  calculateTraitQuantityInCollection(
                    traitElement.weight,
                    summedRarityWeightage,
                    collectionData.totalSupply
                  ).toFixed(0)
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
                    <table className='border-separate border-spacing-x-0 border-spacing-y-1 min-w-full'>
                      <thead className='bg-lightGray'>
                        <tr>
                          <th className='border-t border-l border-b rounded-l-[5px] border-mediumGrey pl-3'>
                            <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                          </th>
                          {['Image', 'Name', 'Estimate in Collection', 'Rarity Score', '%'].map((item, index) => {
                            return (
                              <th
                                key={item}
                                scope='col'
                                className={clsx(
                                  'text-left border-t border-b border-mediumGrey text-xs text-black font-normal uppercase py-3'
                                )}
                              >
                                {item}
                              </th>
                            )
                          })}
                          <th className='pr-3 border-t border-r border-b rounded-r-[5px] border-mediumGrey'>
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
                      </thead>
                      <tbody className='divide-y divide-mediumGrey'>
                        {traitElements.map(({ name, id, layerElementId, updatedAt }: TraitElement, index: number) => (
                          <tr key={index}>
                            <th className='pl-3'>
                              <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                            </th>
                            <td className='py-3'>
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
                            <td className='whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium w-[20%]'>
                              {name}
                            </td>
                            <td className='whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'>
                              <div className='flex space-x-3 items-center justify-start'>
                                <div className='w-16'>
                                  <Textbox
                                    id={`traits.${index}.weight`}
                                    type='number'
                                    name={`traits.${index}.weight`}
                                    value={values.traits[index]?.weight}
                                    onChange={(e) => {
                                      e.persist()
                                      !hasFormChange && setHasFormChange(true)
                                      handleChange(e)
                                    }}
                                  />
                                </div>
                                <span>out of {collectionData.totalSupply}</span>
                              </div>
                            </td>
                            <td className='whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'>
                              {calculateTraitRarityScore(
                                Number(values.traits[index]?.weight),
                                calculateSumArray(values.traits),
                                collectionData.totalSupply
                              )
                                .toFixed(2)
                                .toString()}
                            </td>
                            <td className='whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'>
                              {calculateTraitRarityPercentage(
                                Number(values.traits[index]?.weight),
                                calculateSumArray(values.traits)
                              ).toFixed(2)}
                              %
                            </td>
                            <th className='pr-3'>
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
              {hasFormChange && (
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
              )}
            </>
          )}
        </Formik>
      )}
    </>
  )
}

export default LayerRarityTable
