import { useEffect, useState } from 'react'

export const formatTime = (value: number) => {
  return String(value).padStart(2, '0')
}

export const useSaleCountDown = ({ target }: { target: Date | undefined }) => {
  const [countDown, setCountDown] = useState<number | null>(null)

  useEffect(() => {
    if (!target) return
    const countDownDate = new Date(target).getTime()
    target && setCountDown(countDownDate - new Date().getTime())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!target) return
      const countDownDate = new Date(target).getTime()
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [target])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown: number | null) => {
  if (!countDown || countDown < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
  return {
    days: days > 0 ? days : 0,
    hours: hours > 0 ? hours : 0,
    minutes: minutes > 0 ? minutes : 0,
    seconds: seconds > 0 ? seconds : 0,
  }
}
