import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { trpc } from '@utils/trpc'
import { Form, Formik } from 'formik'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { clientEnv } from 'src/env/schema.mjs'

const LayerGridLoading = () => {
  return (
    <>
      {Array.from(Array(10).keys()).map((index) => {
        return (
          <div key={`${index}`} className='flex flex-col items-center opacity-70'>
            <div className='z-1 animate-pulse'>
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
  const cld = createCloudinary()
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
      resetCanEdit()
      notifyError('Something went wrong')
    },
  })

  return (
    <div className='grid grid-cols-6 gap-6'>
      {!traitElements.length ? (
        // <LayerGridLoading />
        <></>
      ) : (
        traitElements.map((trait: TraitElement, index: number) => {
          return (
            <div key={index} className='cursor-pointer relative col-span-1'>
              <div className='flex flex-col'>
                <div className='pb-[100%] blocks'>
                  <div className='absolute h-full w-full'>
                    <Formik
                      enableReinitialize
                      initialValues={{ name: trait.name }}
                      onSubmit={({ name }) => {
                        mutation.mutate({ id: trait.id, newName: name, oldName: trait.name, repositoryId: repositoryId })
                      }}
                      key={index}
                    >
                      {({ values, handleChange }) => {
                        return (
                          <Form className='relative flex flex-col justify-center items-center'>
                            <div className='overflow-hidden w-full h-full'>
                              <div className='absolute flex flex-col items-center justify-center h-full w-full' key={index}>
                                <div className={`relative h-full w-full`}>
                                  <img
                                    className='rounded-[5px] border border-mediumGrey'
                                    src={cld
                                      .image(
                                        `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${trait.layerElementId}/${trait.id}.png`
                                      )
                                      .toURL()}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* <div
                            key={`${trait.name}-${index}`}
                            className='absolute flex flex-col items-center justify-center h-full w-full'
                          >
                            <div
                              onMouseEnter={() => {
                                setShow(index)
                              }}
                              onMouseLeave={() => {
                                setShow(null)
                              }}
                              className={`relative border-[1px] border-mediumGrey rounded-[5px] h-full w-full`}
                            >
                              <div className={`absolute z-10 right-0 p-1 ${show === index ? '' : 'hidden'}`}>
                                <Popover className='relative'>
                                  <Popover.Button className='bg-lightGray border border-mediumGrey rounded-[3px] w-5 h-5 group inline-flex items-center justify-center'>
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
                              <Image
                                priority
                                src={cld
                                  .image(
                                    `${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${trait.layerElementId}/${trait.id}.png`
                                  )
                                  .toURL()}
                                layout='fill'
                                className='rounded-[5px]'
                              />
                            </div>
                          </div> */}
                          </Form>
                        )
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
              <span className='flex text-xs py-1 items-center justify-center w-full overflow-hidden whitespace-nowrap text-ellipsis'>
                {trait.name}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default LayerGrid
