import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import Button from '@components/UI/Button'
import { Textbox } from '@components/UI/Textbox'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { toPascalCaseWithSpace } from '@utils/format'
import { calculateTraitQuantityInCollection, calculateTraitRarityPercentage } from '@utils/math'
import { trpc } from '@utils/trpc'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import Image from 'next/image'
import router from 'next/router'
import { useEffect, useState } from 'react'

const calculateSumArray = (values: { id: string; weight: number }[]) => {
  return values.reduce((a, b) => a + Number(b.weight), 0) // change to number incase someone accidently changes how textbox works
}

export const RarityDisplay = ({
  traitElements,
  layerName,
  layerId,
}: {
  traitElements: TraitElement[]
  layerName: string
  layerId: string
}) => {
  const { collectionId, repositoryId } = useRepositoryStore((state) => {
    return {
      repositoryId: state.repositoryId,
      collectionId: state.collectionId,
    }
  })
  const { data: collectionData } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string
  const ctx = trpc.useContext()
  const [summedRarityWeightage, setSummedRarityWeightage] = useState<number>(0)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const { notifySuccess, notifyError } = useNotification()

  const mutation = trpc.useMutation('layer.setAllTraits', {
    onSuccess: (data, variables) => {
      ctx.setQueryData(['layer.getLayerById', { id: variables.layerId }], data.changedLayer)
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], data.layers)
      setHasFormChange(false)
      notifySuccess(
        <div>
          <span>{`Successfully updated `}</span>
          <span className='text-blueHighlight text-semibold'>{data.changedLayer?.name}</span>
          <span className='font-semibold'>{` rarities`}</span>
        </div>,
        'rarity changed'
      )
    },
    onError: () => {
      notifyError('Something went wrong')
    },
  })

  useEffect(() => {
    setSummedRarityWeightage(calculateSumArray(traitElements))
  }, [traitElements])

  return (
    <>
      {!summedRarityWeightage || !collectionData ? (
        <table className='w-full table-fixed divide-y divide-mediumGrey'>
          <thead>
            <tr>
              {[
                'Image',
                'Name',
                'Esimate in Collection',
                // 'Rarity Score',
                'Percentage',
              ].map((item, index) => {
                return (
                  <th
                    key={item}
                    scope='col'
                    className={`${
                      index === 3 ? 'text-right' : 'text-left'
                    }  text-xs font-semibold uppercase text-darkGrey pb-8`}
                  >
                    {item}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className='divide-y divide-mediumGrey animate-pulse'>
            {Array.from(Array(5).keys()).map((index) => {
              return (
                <tr key={index}>
                  <td className='py-8'>
                    <AdvancedImage url='/images/logo.png' />
                  </td>
                  <td className='whitespace-nowrap text-sm font-medium'>{'...'}</td>
                  <td className='whitespace-nowrap text-sm font-medium'>{'...'}</td>
                  <td className='whitespace-nowrap text-right text-sm font-medium'>{'...'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            traits: traitElements.map((traitElement: TraitElement) => {
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
            mutation.mutate({
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
          {({
            values,
            errors,
            touched,
            handleChange,
            initialTouched,
            initialValues,
            handleBlur,
            handleSubmit,
            isSubmitting,
            submitForm,
            resetForm,
          }) => (
            <>
              <div className='flex flex-col pb-14'>
                <div className='inline-block min-w-full align-middle'>
                  <Form onSubmit={handleSubmit}>
                    <table className='w-full table-fixed divide-y divide-mediumGrey'>
                      <thead>
                        <tr>
                          {[
                            'Image',
                            'Name',
                            'Quantity in Collection',
                            // 'Rarity Score',
                            'Percentage',
                          ].map((item, index) => {
                            return (
                              <th
                                key={item}
                                scope='col'
                                className={`${
                                  index === 3 ? 'text-right' : 'text-left'
                                }  text-xs font-semibold uppercase text-darkGrey pb-8`}
                              >
                                {item}
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-mediumGrey'>
                        {traitElements.map(({ name, id, layerElementId }: TraitElement, index: number) => (
                          <tr key={index}>
                            <td className='py-8'>
                              <AdvancedImage url={`${layerElementId}/${id}`} />
                            </td>
                            <td className='whitespace-nowrap text-sm font-medium'>{toPascalCaseWithSpace(name)}</td>
                            <td className='whitespace-nowrap text-sm font-medium'>
                              <div className='flex space-x-3 items-center justify-start'>
                                <div className='w-24'>
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
                            {/* <td className='whitespace-nowrap text-sm font-medium'>
                                {calculateTraitRarityScore(
                                    values.traits[index]?.weight,
                                    calculateSumArray(values.traits),
                                    collection.totalSupply
                                  )
                                    .toFixed(2)
                                    .toString()}
                                </td> */}
                            <td className='whitespace-nowrap text-right text-sm font-medium'>
                              {calculateTraitRarityPercentage(
                                Number(values.traits[index]?.weight),
                                calculateSumArray(values.traits)
                              ).toFixed(2)}
                              %
                            </td>
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
