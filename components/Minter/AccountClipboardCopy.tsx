import { CheckIcon } from '@components/Icons/Check'
import { CopyIcon } from '@components/Icons/Copy'
import { truncateWalletAddress } from '@utils/helpers'
import { useCallback,useEffect, useMemo, useState } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'

export const AccountClipboardCopy = () => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isConnected } = useConnect()

  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyAddressAction = useCallback(() => {
    if (account?.address) {
      navigator.clipboard.writeText(account?.address)
      setCopiedAddress(true)
    }
  }, [account?.address])

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copiedAddress])

  const accountAddress = useMemo(() => {
    if (account?.address) {
      return truncateWalletAddress(account.address)
    }
  }, [account?.address])

  const networkName = useMemo(() => {
    if (activeChain) {
      return activeChain.name
    }
  }, [activeChain])
  return (
    <div className="p-4 border border-[#F3F3F3] mb-3 rounded-md flex mt-3 lg:mt-0">
      {isConnected ? (
        <>
          <img src="/images/ethereum.png" className="mr-2" alt="Ethereum Logo" />{' '}
          <span className="font-bold mr-2">{networkName}: </span>
          <span>{accountAddress}</span>
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
