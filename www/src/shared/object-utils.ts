import Big from 'big.js'

export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    acc[predicate(value, index, array)] ||= []
    acc[predicate(value, index, array)]?.push(value)
    return acc
  }, {} as { [key: string]: T[] })

export const sumBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => number) =>
  array.reduce((acc, value, index, array) => {
    return acc + predicate(value, index, array)
  }, 0 as number)

export const sumByBig = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => Big) =>
  array.reduce((acc, value, index, array) => {
    return acc.plus(predicate(value, index, array))
  }, Big(0))

export const convertListToMap = <T extends { [key: string | number]: string | number }, U extends keyof T, V extends keyof T>(
  list: T[],
  key: U,
  secondKey: V
) => {
  const map = {} as Record<T[U], T[V]>
  for (const ele of list) {
    map[ele[key]] = ele[secondKey]
  }
  return map
}
