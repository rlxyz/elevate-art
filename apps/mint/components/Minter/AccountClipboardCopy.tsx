import { CheckIcon } from '@Components/Icons/Check'
import { CopyIcon } from '@Components/Icons/Copy'
import { truncateWalletAddress } from '@Utils/helpers'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'

export const AccountClipboardCopy = () => {
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()

  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyAddressAction = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(true)
    }
  }, [address])

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copiedAddress])

  return (
    <div className="p-4 border border-[#F3F3F3] mb-3 rounded-md flex mt-3 lg:mt-0">
      {isConnected ? (
        <>
          <img src="/images/ethereum.png" className="mr-2" alt="Ethereum Logo" />{' '}
          <span className="font-bold mr-2">{chain?.name}: </span>
          <span>{truncateWalletAddress(address || '')}</span>
          <button className="ml-3" onClick={copyAddressAction}>
            {copiedAddress ? <CheckIcon /> : <CopyIcon />}
          </button>
        </>
      ) : (
        <span>Disconnected</span>
      )}
    </div>
  )
}
