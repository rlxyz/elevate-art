import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import { Button } from '@components/UI/Button'
import { Textbox } from '@components/UI/Textbox'
import { Popover, Transition } from '@headlessui/react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { toPascalCaseWithSpace } from '@utils/format'
import { trpc } from '@utils/trpc'
import { Form, Formik } from 'formik'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useState } from 'react'

const LayerGridLoading = () => {
  return (
    <>
      {Array.from(Array(10).keys()).map((index) => {
        return (
          <div key={`${index}`} className='flex flex-col items-center opacity-70'>
            <div className='z-1'>
              <AdvancedImage url='/images/logo.png' />
            </div>
            <span className='py-2 text-xs invisible'>{'...'}</span>
          </div>
        )
      })}
    </>
  )
}

const LayerGrid = ({ traitElements, layerName }: { traitElements: TraitElement[]; layerName: string }) => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [show, setShow] = useState<number | null>(null)
  const [canEdit, setCanEdit] = useState(-1)
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const resetCanEdit = () => setCanEdit(-1)

  const mutation = trpc.useMutation('trait.setNameById', {
    onSuccess: (data, variables) => {
      // ctx.setQueryData(['layer.getLayerById', { id: variables.layerId }], data.changedLayer)
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], data.layers)
      resetCanEdit()
      notifySuccess(
        <div>
          <span>{`Successfully updated to `}</span>
          <span className='text-blueHighlight text-semibold'>{variables.newName}</span>
          <span className='font-semibold'>{` from ${variables.oldName}`}</span>
        </div>,
        'rarity changed'
      )
    },
    onError: () => {
      notifyError('Something went wrong')
    },
  })

  return (
    <div className='grid grid-cols-6 gap-x-8 gap-y-8'>
      {!traitElements.length ? (
        <LayerGridLoading />
      ) : (
        traitElements.map((trait: TraitElement, index: number) => {
          return (
            <Formik
              enableReinitialize
              initialValues={{ name: trait.name }}
              onSubmit={({ name }) => {
                mutation.mutate({ id: trait.id, newName: name, oldName: trait.name, repositoryId: repositoryId })
              }}
            >
              {({ values, handleChange }) => (
                <Form>
                  <div key={`${trait.name}-${index}`} className='flex flex-col items-center'>
                    <div
                      onMouseEnter={() => {
                        setShow(index)
                      }}
                      onMouseLeave={() => {
                        setShow(null)
                      }}
                      className='relative'
                    >
                      <div className={`absolute z-10 right-0 p-1 ${show === index ? '' : 'hidden'}`}>
                        <Popover className='relative'>
                          <Popover.Button className='bg-lightGrey border border-mediumGrey rounded-[3px] w-5 h-5 group inline-flex items-center justify-center'>
                            <DotsHorizontalIcon className='w-3 h-3 text-darkGrey' />
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-200'
                            enterFrom='opacity-0 translate-y-1'
                            enterTo='opacity-100 translate-y-0'
                            leave='transition ease-in duration-150'
                            leaveFrom='opacity-100 translate-y-0'
                            leaveTo='opacity-0 translate-y-1'
                          >
                            <Popover.Panel className='absolute z-10 w-24'>
                              <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                                <div className='p-2 text-xs justify-start relative bg-white'>
                                  <Button className='' type='button' onClick={() => setCanEdit(index)}>
                                    Edit Name
                                  </Button>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </Popover>
                      </div>
                      <div className='z-1'>
                        <AdvancedImage
                          url={`${organisationName}/${repositoryName}/layers/${layerName}/${toPascalCaseWithSpace(
                            trait.name
                          )}.png`}
                        />
                      </div>
                    </div>
                    {canEdit === index ? (
                      <Textbox
                        className='p-2 text-xs text-center text-black'
                        id={`name`}
                        type='string'
                        name={`name`}
                        value={values.name}
                        onChange={(e) => {
                          e.persist()
                          handleChange(e)
                        }}
                      />
                    ) : (
                      <span className='p-2 text-xs text-center text-black'>{values.name}</span>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          )
        })
      )}
    </div>
  )
}

export default LayerGrid
