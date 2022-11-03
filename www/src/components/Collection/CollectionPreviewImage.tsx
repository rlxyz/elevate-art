import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import * as v from '@utils/compiler'
import { getImageForTrait } from '@utils/image'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  id: number
  collection: Collection
  repositoryId: string
  layers: (LayerElement & { traitElements: (TraitElement & { rulesPrimary: Rules[]; rulesSecondary: Rules[] })[] })[]
  canHover?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type PreviewImageProps = Props & NativeAttrs

export const PreviewImageCardWithChildren: FC<PreviewImageProps> = ({
  id,
  collection,
  layers,
  repositoryId,
  children,
  className,
  canHover = false,
  ...props
}) => {
  const elements = v.one(
    v.parseLayer(
      layers.map((l) => ({
        ...l,
        traits: l.traitElements.map((t) => ({
          ...t,
          rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
            ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
              type: condition as v.RulesType,
              with: left === t.id ? right : left,
            })
          ),
        })),
      }))
    ),
    v.seed(repositoryId, collection.name, collection.generations, id)
  )

  const hash = v.hash(elements)

  return (
    <div className={clsx(className, 'relative flex-col h-full w-full overflow-hidden')} {...props}>
      <div className='relative overflow-hidden h-[75%] w-full flex items-center'>
        {elements.map(([l, t], index) => {
          return (
            <img
              key={`${hash}-${t}-${index}`}
              className={clsx('absolute w-full border-box object-contain')}
              src={getImageForTrait({
                r: repositoryId,
                l,
                t,
              })}
            />
          )
        })}
      </div>
      <div className='h-[25%] flex flex-col w-full'>{children}</div>
    </div>
  )
}

export const PreviewImageCardStandalone: FC<PreviewImageProps> = ({
  id,
  collection,
  layers,
  repositoryId,
  children,
  className,
  canHover = false,
  ...props
}: PreviewImageProps) => {
  const elements = v.one(
    v.parseLayer(
      layers.map((l) => ({
        ...l,
        traits: l.traitElements.map((t) => ({
          ...t,
          rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
            ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
              type: condition as v.RulesType,
              with: left === t.id ? right : left,
            })
          ),
        })),
      }))
    ),
    v.seed(repositoryId, collection.name, collection.generations, id)
  )

  const hash = v.hash(elements)

  return (
    <div className='h-[50vh] w-auto flex items-center'>
      {elements.map(([l, t], index) => {
        return (
          <img
            key={`${hash}-${t}-${index}`}
            className={clsx('absolute w-full border-box object-contain')}
            src={getImageForTrait({
              r: repositoryId,
              l,
              t,
            })}
          />
        )
      })}
    </div>
  )
}
