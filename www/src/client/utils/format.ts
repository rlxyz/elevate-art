export const toPascalCaseWithSpace = (name: string) => {
  return name
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(/\.[^.]*$/, '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => ` ${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const capitalize = (s: string) => s[0]?.toUpperCase() + s.slice(1) || ''

export const clsx = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const formatBytes = (a: number, b = 2) => {
  if (!+a) return '0 Bytes'
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024))
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]}`
}

export const truncate = (word: string, variant?: 'sm' | 'lg') => {
  return variant ? (variant === 'sm' ? word.replace(/(.{6})..+/, '$1...') : word.replace(/(.{18})..+/, '$1...')) : word
}

export const routeBuilder = (...routes: (string | undefined | null)[]) => {
  return (
    `/` +
    routes
      .filter((s): s is string => Boolean(s))
      .map((x) => encodeURIComponent(x.replace('/', '')))
      .join('/')
  )
}
