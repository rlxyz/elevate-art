import { useMutateRepositoryLayersWeight } from '@hooks/mutations/useMutateRepositoryLayersWeight'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { truncate } from '@utils/format'
import { getImageForTrait } from '@utils/image'
import { calculateTraitQuantityInCollection } from '@utils/math'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Table } from '../Layout/core/Table'

const tableHeaders = [
  { title: <></> },
  { title: <></> },
  { title: <>Name</> },
  {
    title: <>Estimate in Collection</>,
    description: <>We linearly distribute the rarity changes to the rest of the traits in this layer.</>,
  },

  {
    title: <>Rarity Score</>,
    description: <>This is the rarity score of each trait in this layer. It is based on the OpenRarity standard.</>,
  },

  { title: <>%</> },
]

export const calculateSumArray = (values: { weight: number }[] | undefined) => {
  return values?.reduce((a, b) => a + Number(b.weight), 0) || 0 // change to number incase someone accidently changes how textbox works
}

const LoadingTable = () => {
  return (
    <Table>
      <Table.Head loading={true}>
        {tableHeaders.map(({ title, description }, index) => {
          return <Table.Head.Row key={index} title={title} description={description} />
        })}
      </Table.Head>
      <Table.Body loading={true}>
        {Array.from(Array(10).keys()).map((_, index) => {
          return (
            <Table.Body.Row key={index} current={index} total={10} loading={true}>
              <Table.Body.Row.Data>
                <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center' />
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
            </Table.Body.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

const LayerRarityTable = ({ traitElements }: { traitElements: TraitElement[] | undefined }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const { current: collection } = useQueryRepositoryCollection()
  const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })
  const { current: layer } = useQueryRepositoryLayer()
  const summedRarityWeightage = calculateSumArray(layer?.traitElements)
  return (
    <>
      {!summedRarityWeightage || !collection || !layer ? (
        <LoadingTable />
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
                <Table.Head loading={!collection && !layer}>
                  {tableHeaders.map(({ title, description }, index) => {
                    return <Table.Head.Row key={index} title={title} description={description} />
                  })}
                </Table.Head>
                <Table.Body>
                  {traitElements?.map(({ name, id, layerElementId }: TraitElement, index: number) => (
                    <Table.Body.Row key={id} current={index} total={traitElements?.length}>
                      <Table.Body.Row.Data>
                        {/* <div className='w-4 h-4 border border-border bg-white rounded-[3px]' /> */}
                        <></>
                      </Table.Body.Row.Data>
                      <Table.Body.Row.Data>
                        <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
                          <div className='rounded-[5px] border border-border'>
                            <img
                              className='w-10 lg:w-16 h-auto rounded-[5px]'
                              src={getImageForTrait({
                                r: repositoryId,
                                l: layerElementId,
                                t: id,
                              })}
                            />
                          </div>
                        </div>
                      </Table.Body.Row.Data>
                      <Table.Body.Row.Data>{truncate(name)}</Table.Body.Row.Data>
                      <Table.Body.Row.Data>
                        <div className='flex space-x-3 items-center justify-start'>
                          <div className='w-20'>
                            <input
                              className='bg-white text-xs w-full border border-border rounded-[5px] p-2'
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
                      </Table.Body.Row.Data>
                      <Table.Body.Row.Data>
                        <span className='whitespace-nowrap text-ellipsis w-16'>
                          {Number(-Math.log((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)).toFixed(3)) %
                            Infinity || 0}
                        </span>
                      </Table.Body.Row.Data>
                      <Table.Body.Row.Data>
                        {(((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)) * 100).toFixed(3)}%
                      </Table.Body.Row.Data>
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
