const EPOCHS = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
]
const getDuration = (timeAgoInSeconds: number) => {
  for (const [name, seconds] of EPOCHS) {
    const interval = Math.floor(timeAgoInSeconds / (seconds as number))
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name,
      }
    }
  }
  return null
}
export const timeAgo = (date: Date) => {
  const timeAgoInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  const duration = getDuration(timeAgoInSeconds)
  if (!duration) return 'just now'
  const { interval, epoch } = duration
  const suffix = interval === 1 ? '' : 's'
  return `${interval} ${epoch}${suffix} ago`
}
