import { Link } from '@components/UI/Link'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import useRepositoryRouterStore from '@hooks/useRepositoryRouterStore'
import { motion } from 'framer-motion'
import router from 'next/router'
import { LayerSectionEnum } from 'src/types/enums'

export const RepositoryNavbar = () => {
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string
  const { currentLayer } = useCurrentLayer()
  const currentViewSection = useRepositoryRouterStore((state) => state.currentViewSection)

  return (
    <aside className='-ml-5'>
      <ul className='flex list-none'>
        {currentLayer &&
          [
            { name: LayerSectionEnum.enum.Preview, route: `${LayerSectionEnum.enum.Preview}` },
            {
              name: LayerSectionEnum.enum.Layers,
              route: `${LayerSectionEnum.enum.Layers}/${currentLayer?.name}`,
            },
            {
              name: LayerSectionEnum.enum.Rarity,
              route: `${LayerSectionEnum.enum.Rarity}/${currentLayer?.name}`,
            },
            {
              name: LayerSectionEnum.enum.Rules,
              route: `${LayerSectionEnum.enum.Rules}/${currentLayer?.name}`,
            },
            // {
            //   name: LayerSectionEnum.enum.Settings,
            //   route: `${LayerSectionEnum.enum.Settings}`,
            // },
          ].map(({ name, route }: { name: string; route: string }, index: number) => {
            return (
              <li
                key={index}
                className={
                  name === currentViewSection ? 'flex space-between items-center relative' : ''
                }
              >
                <div className='mb-1'>
                  <Link
                    enabled={currentViewSection === name}
                    title={name}
                    size='md'
                    href={`/${organisationName}/${repositoryName}/tree/${collectionName}/${route}`}
                  ></Link>
                </div>
                {name === currentViewSection && (
                  <motion.div
                    className='absolute bg-black mx-3 h-[2px] bottom-[-1px] left-0 right-0'
                    layoutId='underline'
                  />
                )}
              </li>
            )
          })}
      </ul>
    </aside>
  )
}
