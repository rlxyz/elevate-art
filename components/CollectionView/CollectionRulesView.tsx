import { TraitElement } from '@utils/types'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { formatLayerName } from '@utils/format'
import { useEffect, useState } from 'react'
import { createCloudinary } from '@utils/cloudinary'
import {
  calculateTraitQuantityInCollection,
  calculateTraitRarityFromQuantity,
  calculateTraitRarityPercentage,
  calculateTraitRarityScore,
} from '@utils/math'
import { NextRouter, useRouter } from 'next/router'
import AdvancedImage from '@components/CloudinaryImage/AdvancedImage'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { fetcher, fetcherPost } from '@utils/fetcher'
import { CollectionViewContent } from './ViewContent'
import { Textbox } from '@components/UI/Textbox'
import { Button } from '@components/UI/Button'
import Image from 'next/image'

const CollectionRulesView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  const { currentLayerPriority, collection, currentLayer, setCurrentLayer } =
    useCompilerViewStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentLayer: state.currentLayer,
        collection: state.collection,
        setCurrentLayer: state.setCurrentLayer,
      }
    })

  const [traits, setTraits] = useState<TraitElement[]>([])
  const [traitsTotalWeight, setTraitsTotalWeight] = useState<number>(0)

  useEffect(() => {
    setCurrentLayer(currentLayerPriority)
  }, [currentLayerPriority])

  useEffect(() => {
    const { traits } = currentLayer
    setTraits(traits)
    setTraitsTotalWeight(
      traits.reduce(
        (previousValue, currentValue) => previousValue + currentValue.weight,
        0
      )
    )
  }, [currentLayer])

  useEffect(() => {
    traits.length > 0 &&
      setTraitsTotalWeight(
        traits.reduce(
          (previousValue, currentValue) => previousValue + currentValue.weight,
          0
        )
      )
  }, [traits])

  return (
    <CollectionViewContent
      title={currentLayer.name}
      description='Set how often you want certain images to appear in the generation'
    >
      <div className='p-8 flex flex-col'>
        <div className='grid grid-cols-6 gap-y-4'>
          <div className='col-span-4'>
            <div className='inline-block min-w-full align-middle'>
              <table className='min-w-full'>
                <thead>
                  <tr>
                    {[
                      'Image',
                      'Name',
                      'Quantity in Collection',
                      'Rarity Score',
                      'Percentage',
                    ].map((item) => {
                      return (
                        <th
                          key={item}
                          scope='col'
                          className='text-left text-xs font-semibold uppercase text-darkGrey'
                        >
                          {item}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className='divide-y divide-lightGray'>
                  {traits.map((trait: TraitElement, index: number) => {
                    return (
                      <Formik
                        key={index}
                        initialValues={{
                          rarity: calculateTraitQuantityInCollection(
                            trait.weight,
                            traitsTotalWeight,
                            collection.totalSupply
                          ),
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                          setTimeout(() => {
                            fetcherPost(`trait/${trait.id}`, {
                              weight: calculateTraitRarityFromQuantity(
                                values.rarity,
                                traitsTotalWeight,
                                collection.totalSupply
                              ).toFixed(0),
                            })
                            setSubmitting(false)
                          }, 400)
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                          submitForm,
                        }) => (
                          <>
                            <tr key={index}>
                              <td className='p-8 pl-0'>
                                <AdvancedImage
                                  width={125}
                                  height={125}
                                  url={`${organisationName}/${repositoryName}/layers/${
                                    currentLayer.name
                                  }/${formatLayerName(trait.name)}.png`}
                                />
                              </td>
                              <td className='whitespace-nowrap text-sm font-medium'>
                                {formatLayerName(trait.name)}
                              </td>
                              <td className='whitespace-nowrap text-sm font-medium text-gray-900'>
                                {/* <form>
                                  <Textbox
                                    id=''
                                    placeholder=''
                                    type='number'
                                    name='rarity'
                                    onChange={(e) => {
                                      handleChange(e)
                                      const rarity =
                                        calculateTraitRarityFromQuantity(
                                          values.rarity,
                                          traitsTotalWeight + values.rarity,
                                          collection.totalSupply
                                        )
                                      setTraits([
                                        ...traits.slice(0, index),
                                        {
                                          ...trait,
                                          weight: rarity,
                                        },
                                        ...traits.slice(index + 1),
                                      ])
                                      // submitForm()
                                    }}
                                    value={values.rarity}
                                  ></Textbox>
                                  <span>out of {collection.totalSupply}</span>
                                </form> */}
                                Nothing
                              </td>
                              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0'>
                                {calculateTraitRarityScore(
                                  trait.weight,
                                  traitsTotalWeight,
                                  collection.totalSupply
                                )
                                  .toFixed(2)
                                  .toString()}
                              </td>
                              <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0'>
                                {calculateTraitRarityPercentage(
                                  trait.weight,
                                  traitsTotalWeight
                                ).toFixed(2)}
                                %
                              </td>
                            </tr>
                          </>
                        )}
                      </Formik>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className='col-span-2'>
            <div className='mt-12 ml-8'>
              <div className='border rounded-[5px] border-lightGray'>
                <div className='p-8 flex flex-col font-plus-jakarta-sans text-sm'>
                  <span className='font-semibold'>
                    Need some help with how rarities work? Check this guide
                    here.
                  </span>
                  <p className='my-8'>
                    This is an example of how we structure rarities for NFT
                    collections.
                  </p>
                  <Button
                    className='text-sm border rounded-[5px] p-2'
                    onClick={() => {
                      console.log('todo: implement button')
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* todo: implement when something changes in rarity
      <footer className='fixed bottom-0 h-[10%] w-full bg-hue-light border-t border-t-lightGray'>
        <div className='flex items-center h-full w-full'>
          <div className='flex justify-end w-3/4'>
            <div className='flex items-center space-x-3 mr-6'>
              <Image src='/images/tooltip.svg' height={15} width={15} />
              <span className='text-redDot text-sm'>
                You’ve made some changes, please update
              </span>
            </div>
            <div className='space-x-6'>
              <Button>Update</Button>
              <Button disabled>Save</Button>
            </div>
          </div>
        </div>
      </footer> */}
    </CollectionViewContent>
  )
}

export default CollectionRulesView
