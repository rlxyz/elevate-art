import { useEffect, useState } from 'react'

export const useSetMintTimeInput = ({ enabled, currentTime }: { enabled: boolean; currentTime: Date }) => {
  const [mintTime, setMintTime] = useState<Date>(currentTime)

  useEffect(() => {
    if (!enabled) {
      setMintTime(currentTime)
    }
  }, [enabled])

  return { mintTime, setMintTime }
}
