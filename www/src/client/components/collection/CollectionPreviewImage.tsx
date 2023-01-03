import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import clsx from 'clsx'
import { FC } from 'react'
import { getImageForTrait } from 'src/client/utils/image'
import * as v from 'src/shared/compiler'

interface Props {
  id: number
  collection: Collection
  layers: (LayerElement & { traitElements: (TraitElement & { rulesPrimary: Rules[]; rulesSecondary: Rules[] })[] })[]
  elements?: [string, string][]
  canHover?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type PreviewImageProps = Props & NativeAttrs

export const PreviewImageCardWithChildren: FC<PreviewImageProps> = ({
  id,
  collection,
  layers,
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
    v.seed(collection.repositoryId, collection.name, collection.generations, id)
  )

  const hash = v.hash(elements)

  return (
    <div className={clsx(className, 'relative flex-col h-full w-full overflow-hidden')} {...props}>
      <div className='relative overflow-hidden h-[75%] w-full flex items-center'>
        {elements
          .filter(([l, t]) => !t.startsWith('none'))
          .map(([l, t], index) => {
            return (
              <img
                key={`${hash}-${t}-${index}`}
                className={clsx('absolute w-full border-box object-contain')}
                src={getImageForTrait({
                  r: collection.repositoryId,
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

export const PreviewImageCardStandaloneNoNone: FC<PreviewImageProps> = ({
  id,
  collection,
  layers,
  children,
  elements,
  className,
  canHover = false,
  ...props
}: PreviewImageProps) => {
  if (!elements) return null
  const hash = v.hash(elements)
  return (
    <>
      {elements
        .filter(([l, t]) => !t.startsWith('none'))
        .map(([l, t], index) => {
          return (
            <img
              key={`${hash}-${t}-${index}`}
              className={clsx('absolute w-full object-contain rounded-[5px]')}
              // width={100}
              // className={clsx('border object-contain')}
              src={getImageForTrait({
                r: collection.repositoryId,
                l,
                t,
              })}
            />
          )
        })}
    </>
  )
}

export const PreviewImageCardStandalone: FC<PreviewImageProps> = ({
  id,
  collection,
  layers,
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
    v.seed(collection.repositoryId, collection.name, collection.generations, id)
  )

  const hash = v.hash(elements)

  return (
    <div className={clsx(className, 'rounded-[5px]')}>
      {elements
        .filter(([l, t]) => !t.startsWith('none'))
        .map(([l, t], index) => {
          return (
            <img
              key={`${hash}-${t}-${index}`}
              width={100}
              className={clsx('absolute w-full h-full object-contain rounded-[5px]')}
              // className={clsx('border object-contain')}
              src={getImageForTrait({
                r: collection.repositoryId,
                l,
                t,
              })}
            />
          )
        })}
    </div>
  )
}
