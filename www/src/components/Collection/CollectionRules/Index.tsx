import Loading from '@components/UI/Loading'
import { useCurrentLayer } from '@hooks/useCurrentLayer'
import { useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import clsx from 'clsx'
import RuleSelector from './RuleSelector'

const Index = () => {
  const { currentLayer, isLoading, isError } = useCurrentLayer()
  const { data: layers } = useQueryRepositoryLayer()
  if (isLoading || !currentLayer) return <Loading />
  if (isError) return <div>Error...</div>

  return (
    <>
      <div className='left-0 absolute space-y-3 w-full'>
        <div className='w-full py-16 border-b border-mediumGrey'>
          <div className={clsx('flex justify-center')}>
            <div className='w-[90%] lg:w-[75%] 2xl:w-[70%] 3xl:w-[50%]'>
              <div className='space-y-1 -translate-y-2'>
                <span className='text-xs font-semibold uppercase'>Create a condition</span>
                <RuleSelector />
              </div>
            </div>
          </div>
        </div>
        {/* <div className='w-full'>
          <div className={clsx('flex justify-center')}>
            <div className='w-[90%] lg:w-[75%] 2xl:w-[70%] 3xl:w-[50%]'>
              <div className='space-y-3 pt-3'>
                <span className='block text-xs font-semibold uppercase'>All rules created</span>
                <div className='flex flex-col space-y-3'>
                  {layers
                    ?.flatMap((x) => x.traitElements)
                    ?.filter((t) => t.rulesPrimary.length || t.rulesSecondary.length)
                    .map((trait, index) => (
                      <Disclosure key={index}>
                        <Disclosure.Button className={`border border-mediumGrey rounded-[5px] p-2 grid grid-cols-10 w-full`}>
                          <div className='px-1 items-start flex'>
                            <span className='text-xs'>{trait.name}</span>
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className='py-2'>
                          <RuleDisplayAll traitElement={trait} />
                        </Disclosure.Panel>
                      </Disclosure>
                    ))}
                  {layers && <RuleDisplayAll traitElements={layers.flatMap((x) => x.traitElements)} />}
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default Index
