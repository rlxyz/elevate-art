import { Layout } from '@components/layout/core/Layout'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import withOrganisationStore from '@components/withOrganisationStore'
import { SelectorIcon } from '@heroicons/react/outline'
import { LayerElement, useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useRaisedShadow } from '@hooks/utils/useRaisedShadow'
import { Repository } from '@prisma/client'
import { OrganisationNavigationEnum } from '@utils/enums'
import clsx from 'clsx'
import { AnimatePresence, Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { FormHeader, FormLayout, FormStepEnum, FormSteps } from '.'

interface Props {
  repositoryId: string
  item: LayerElement
}

export type ReorderItemProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const LayerElementReorderItem: FC<ReorderItemProps> = ({ repositoryId, item, className, ...props }) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className={clsx(
        className,
        'bg-lightGray relative flex w-full items-center border border-mediumGrey rounded-[5px] px-4 py-2 cursor-move'
      )}
      onPointerDown={(e) => {
        e.preventDefault()
        dragControls.start(e)
      }}
    >
      <SelectorIcon className='absolute w-3 h-3' />
      <span className='mx-7 w-full flex items-center text-xs whitespace-nowrap overflow-hidden' {...props}>
        {item.name}
      </span>
    </Reorder.Item>
  )
}

interface LayerElementReorderProps {
  layerElements: LayerElement[]
  repository: Repository
}

const FormLayerElementReorder: FC<LayerElementReorderProps> = ({ repository, layerElements }) => {
  const sorted = layerElements.sort((a, b) => a.priority - b.priority)
  const [items, setItems] = useState<LayerElement[]>(sorted)
  console.log(items)
  return (
    <div className='grid grid-cols-10 gap-x-6'>
      <div className='col-span-5 w-full'>
        <AnimatePresence>
          <Reorder.Group
            axis='y'
            layoutScroll
            values={items}
            className='flex flex-col space-y-2 max-h-[calc(100vh-17.5rem)] no-scrollbar overflow-y-scroll rounded-[5px] p-2 overflow-hidden'
            onReorder={setItems}
          >
            {items.map((x) => (
              <LayerElementReorderItem key={x.id} item={x} repositoryId={repository.id} />
            ))}
          </Reorder.Group>
        </AnimatePresence>
      </div>
      <div className='col-span-5 relative h-full w-full'>
        {/* <PreviewImageCardStandaloneNoNone
          id={0}
          elements={orderedElements}
          collection={{
            id: '',
            name: 'reorder',
            type: '',
            totalSupply: 1,
            generations: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            repositoryId: repository.id,
          }}
          layers={items}
        /> */}
      </div>
    </div>
  )
}

const Page: NextPage = () => {
  const router = useRouter()
  const { name } = router.query as { name: string }
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()
  const { current: repository } = useQueryRepositoryFindByName({
    organisationName: organisation?.name || '',
    repositoryName: name,
  })
  const { all: layerElements } = useQueryLayerElementFindAll({
    repositoryId: repository?.id || '',
  })
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
            <FormHeader
              title="You're are almost done."
              description='Time to change the priority of your layers to ensure your art aligns properly'
            />
            <FormLayout className='grid grid-cols-7 gap-12'>
              <FormSteps className='col-span-2 divide-y divide-mediumGrey space-y-12' currentStep={FormStepEnum.enum.OrderLayer} />
              <div className='col-span-5 border border-mediumGrey rounded-[5px]'>
                <FormLayerElementReorder layerElements={layerElements} repository={repository} />
              </div>
            </FormLayout>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
