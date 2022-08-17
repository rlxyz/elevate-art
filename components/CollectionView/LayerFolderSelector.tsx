import FileUpload from '@components/CloudinaryImage/FileUpload'
import { Button } from '@components/UI/Button'
import { CubeIcon, FolderIcon, SelectorIcon } from '@heroicons/react/outline'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { NextRouter, useRouter } from 'next/router'

import { CustomRulesEnum, LayerSectionEnum } from './Index'

const LayerFolderSelector = () => {
  const {
    layers,
    regenerate,
    currentViewSection,
    currentLayerPriority,
    setRegenerateCollection,
    currentCustomRulesViewSection,
    setCurrentLayerPriority,
    setCurrentCustomRulesViewSection,
  } = useCompilerViewStore((state) => {
    return {
      layers: state.layers,
      regenerate: state.regenerate,
      currentViewSection: state.currentViewSection,
      currentLayerPriority: state.currentLayerPriority,
      currentCustomRulesViewSection: state.currentCustomRulesViewSection,
      setCurrentCustomRulesViewSection: state.setCurrentCustomRulesViewSection,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  return (
    layers &&
    layers.length > 0 && (
      // calc(100vh-13rem) is the height of the Header & ViewContent
      <main className='p-8'>
        <div className='mb-8 h-10'>
          <Button
            onClick={() => {
              !regenerate && setRegenerateCollection(true)
            }}
          >
            Generate New
          </Button>
        </div>
        <div
          className={`pb-4 mb-4 ${
            currentViewSection === LayerSectionEnum.RULES
              ? 'border-b border-b-lightGray'
              : ''
          }`}
        >
          <span className='text-xs font-semibold text-darkGrey uppercase'>
            Layers
          </span>
          <div className='mt-4'>
            <FileUpload id={`${organisationName}/${repositoryName}`}>
              {layers
                .map((layer) => {
                  return layer.name
                })
                .map((layerName: string, index: number) => {
                  return (
                    <a // eslint-disable-line
                      className={`flex mt-2 flex-row p-[4px] rounded-[5px] ${
                        currentLayerPriority === index &&
                        currentCustomRulesViewSection === null
                          ? 'bg-lightGray font-semibold'
                          : 'text-darkGrey'
                      }`}
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentCustomRulesViewSection(null)
                        setCurrentLayerPriority(index)
                      }}
                    >
                      <FolderIcon width={20} height={20} />
                      <span className='ml-2 text-sm'>{layerName}</span>
                    </a>
                  )
                })}
            </FileUpload>
          </div>
        </div>
        {currentViewSection === LayerSectionEnum.RULES && (
          <div>
            <span className='text-xs font-semibold text-darkGrey uppercase'>
              Custom Rules
            </span>
          </div>
        )}
        {/* todo: implement search */}
        {/* <Textbox
          id='search-trait'
          name='search-trait'
          placeholder='Search Trait'
        /> */}
      </main>
    )
  )
}

export default LayerFolderSelector
