import { PreviewImageCardStandaloneNoNone } from '@components/create/collection/CollectionPreviewImage'
import type { LayerElement } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import type { Repository } from '@prisma/client'
import clsx from 'clsx'
import { AnimatePresence, Reorder } from 'framer-motion'
import type { FC } from 'react'
import * as v from 'src/shared/compiler'
import { LayerElementReorderItem } from './LayerElementReorderItem'

export interface Props {
  repository: Repository
  layerElements: LayerElement[]
  items: LayerElement[]
  setItems: (items: LayerElement[]) => void
}

export type ReorderProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const LayerElementReorder: FC<ReorderProps> = ({ repository, layerElements, items, setItems, className, ...props }) => {
  const sorted = layerElements.sort((a, b) => a.priority - b.priority)

  const elements = v
    .one(
      v.parseLayer(
        sorted.map((l) => ({
          ...l,
          traits: l.traitElements
            .filter((x) => !x.readonly)
            .map((t) => ({
              ...t,
              weight: t.weight || 1,
              rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
                ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
                  type: condition as v.RulesType,
                  with: left === t.id ? right : left,
                })
              ),
            })),
        }))
      ),
      v.seed('', '', 1, '')
    )
    .reverse()

  /** Maps Reordered List to Element */
  const orderedElements: [string, string][] = []
  items.map((item, index) => {
    const element = elements[item.priority]
    if (!element) return
    orderedElements.push(element)
  })
  orderedElements.reverse()

  return (
    <div className={clsx(className, 'grid grid-cols-10 gap-x-6')} {...props}>
      <div className='col-span-5'>
        <AnimatePresence>
          <Reorder.Group
            axis='y'
            layoutScroll
            values={items}
            className='flex flex-col space-y-2 max-h-[calc(100vh-17.5rem)] no-scrollbar overflow-y-scroll rounded-[5px] overflow-hidden'
            onReorder={setItems}
          >
            {items.map((x) => (
              <LayerElementReorderItem key={x.id} item={x} repositoryId={repository.id} />
            ))}
          </Reorder.Group>
        </AnimatePresence>
      </div>
      <div className='col-span-5 relative h-full w-full'>
        <PreviewImageCardStandaloneNoNone
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
        />
      </div>
    </div>
  )
}
