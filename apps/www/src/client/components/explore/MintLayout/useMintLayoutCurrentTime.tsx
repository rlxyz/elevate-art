import { useEffect, useState } from 'react'

export const useMintLayoutCurrentTime = () => {
  const [now, setNow] = useState(new Date())

  // create an interval that updates the date.time object
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return { now }
}
