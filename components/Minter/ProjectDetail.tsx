import { config } from '@utils/config'

export const ProjectDetail = () => {
  return (
    <>
      <img src={config.projectProfileImage} alt={config.projectOwner} />
      <div className="flex flex-col ml-3">
        <div className="mb-1">
          <h1 className="text-2xl font-bold">{config.projectName}</h1>
        </div>
        <div className="flex items-center mb-1">
          <img
            src="/images/supply.svg"
            className="inline-block mr-2"
            alt="Project Supply"
          />
          <span className="text-sm">{`${config.totalSupply} Supply`}</span>
        </div>
        <div className="flex items-center">
          <img src="/images/price.svg" className="inline-block mr-2" alt="NFT Price" />
          <span className="text-sm">{`${config.ethPrice} ETH`}</span>
        </div>
      </div>
    </>
  )
}
