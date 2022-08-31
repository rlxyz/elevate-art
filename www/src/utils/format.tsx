export const toPascalCaseWithSpace = (name: string) => {
  return name
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(/\.[^.]*$/, '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => ` ${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}
