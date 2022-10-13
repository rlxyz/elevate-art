import { useMutateRepositoryLayersWeight } from '@hooks/mutations/useMutateRepositoryLayersWeight'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { getImageForTrait } from '@utils/image'
import { calculateTraitQuantityInCollection } from '@utils/math'
import clsx from 'clsx'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Table } from '../Layout/core/Table'

export const calculateSumArray = (values: { weight: number }[] | undefined) => {
  return values?.reduce((a, b) => a + Number(b.weight), 0) || 0 // change to number incase someone accidently changes how textbox works
}

const LayerRarityTable = ({ traitElements }: { traitElements: TraitElement[] | undefined }) => {
  const cld = createCloudinary()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const { current: collection } = useQueryRepositoryCollection()
  const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })
  const { current: layer } = useQueryRepositoryLayer()

  const summedRarityWeightage = calculateSumArray(layer?.traitElements)

  return (
    <>
      {!summedRarityWeightage || !collection || !layer ? (
        <div>loading...</div>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            traits: layer.traitElements.map((traitElement: TraitElement) => {
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
              layerId: layer.id,
              traits: values.traits.map(({ id, weight }: { id: string; weight: number }) => {
                return {
                  id,
                  weight: (weight / calculateSumArray(values.traits)) * 100,
                }
              }),
            })
          }}
        >
          {({ values, handleChange, handleSubmit, resetForm }) => (
            <Form onSubmit={handleSubmit} className='overflow-hidden'>
              <Table>
                <Table.Head>
                  {[
                    { title: <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' /> },
                    { title: <></> },
                    { title: <>Name</> },
                    {
                      title: <>Estimate in Collection</>,
                      description: <>We linearly distribute the rarity changes to the rest of the traits in this layer.</>,
                    },

                    {
                      title: <>Rarity Score</>,
                      description: (
                        <>This is the rarity score of each trait in this layer. It is based on the OpenRarity standard.</>
                      ),
                    },

                    { title: <>%</> },
                    { title: <></> },
                  ].map(({ title, description }, index) => {
                    return <Table.Head.Row title={title} description={description} />
                  })}
                </Table.Head>
                <Table.Body>
                  {traitElements?.map(({ name, id, layerElementId }: TraitElement, index: number) => (
                    <Table.Body.Row key={id}>
                      {/* <Table.Body.Row.Data></Table.Body.Row.Data> */}
                      <td
                        className={clsx(
                          index === traitElements.length - 1 && 'border-b rounded-bl-[5px]',
                          'pl-3 border-l border-t border-mediumGrey'
                        )}
                      >
                        <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                      </td>
                      <td className={clsx(index === traitElements.length - 1 && 'border-b', 'py-3  border-t border-mediumGrey')}>
                        <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
                          <img
                            className='absolute w-10 lg:w-20 h-auto rounded-[5px] border border-mediumGrey'
                            src={getImageForTrait({
                              r: repositoryId,
                              l: layerElementId,
                              t: id,
                            })}
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
                        {Number(-Math.log((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)).toFixed(3)) %
                          Infinity || 0}
                      </td>
                      <td
                        className={clsx(
                          index === traitElements.length - 1 && 'border-b',
                          'border-t border-mediumGrey whitespace-nowrap overflow-hidden text-ellipsis text-xs font-medium'
                        )}
                      >
                        {(((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)) * 100).toFixed(3)}%
                      </td>
                      <td
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
                      </td>
                    </Table.Body.Row>
                  ))}
                </Table.Body>
              </Table>
            </Form>
          )}
        </Formik>
      )}
    </>
  )
}

export default LayerRarityTable
