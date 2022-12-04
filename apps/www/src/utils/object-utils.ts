import Big from "big.js";

export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) =>
  array.reduce((acc, value, index, array) => {
    acc[predicate(value, index, array)] ||= [];
    acc[predicate(value, index, array)]?.push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const sumBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => number) =>
  array.reduce((acc, value, index, array) => {
    return acc + predicate(value, index, array);
  }, 0 as number);

export const sumByBig = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => Big) =>
  array.reduce((acc, value, index, array) => {
    return acc.plus(predicate(value, index, array));
  }, Big(0));
