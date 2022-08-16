import { FolderIcon, CubeIcon, SelectorIcon } from '@heroicons/react/outline'
import FileUpload from '@components/CloudinaryImage/FileUpload'
import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { NextRouter, useRouter } from 'next/router'
import { Textbox } from '@components/UI/Textbox'
import layer from 'pages/api/[organisation]/[repository]/layer'
import { LayerSectionEnum } from './Index'

const LayerFolderSelector = () => {
  const {
    setCurrentLayerPriority,
    currentViewSection,
    currentLayerPriority,
    layers,
  } = useCompilerViewStore((state) => {
    return {
      currentViewSection: state.currentViewSection,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      currentLayerPriority: state.currentLayerPriority,
      layers: state.layers,
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
        <div
          className={`pb-4 mb-4 ${
            currentViewSection === LayerSectionEnum.RULES
              ? 'border-b border-b-lightGray'
              : ''
          }`}
        >
          <span className='text-xs font-semibold text-darkGrey uppercase'>
            Files
          </span>
          <div className='mt-4'>
            <FileUpload id={`${organisationName}/${repositoryName}`}>
              {layers
                .map((layer) => {
                  return layer.name
                })
                .map((layerName: string, index: number) => {
                  return (
                    <a
                      className={`flex mt-2 flex-row p-[4px] rounded-[5px] ${
                        currentLayerPriority === index
                          ? 'bg-lightGray font-semibold'
                          : 'text-darkGrey'
                      }`}
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
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
            <div className='mt-4'>
              {[
                {
                  name: 'Trait Rules',
                  icon: <CubeIcon width={20} height={20} />,
                },
                {
                  name: 'Layer Order',
                  icon: <SelectorIcon width={20} height={20} />,
                },
              ].map(({ name, icon }, index) => {
                return (
                  <a
                    key={`${name}-${index}`}
                    className={`flex mt-2 flex-row p-[4px] rounded-[5px] ${
                      currentLayerPriority === index + layers.length
                        ? 'bg-lightGray font-semibold'
                        : 'text-darkGrey'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentLayerPriority(index + layers.length)
                    }}
                  >
                    {icon}
                    <span className='ml-2 text-sm'>{name}</span>
                  </a>
                )
              })}
            </div>
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
