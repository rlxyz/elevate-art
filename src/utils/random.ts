// sources: https://www.delftstack.com/howto/javascript/javascript-random-seed-to-generate-random/
export const mh3 = (str: string): (() => number) => {
  let hash: number
  for (let i = 0, hash = 1779033703 ^ str.length; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return (hash ^= hash >>> 16) >>> 0
  }
}

export const sfc32 = (a: number, b: number, c: number, d: number): (() => number) => {
  return () => {
    a >>>= 0
    b >>>= 0
    c >>>= 0
    d >>>= 0
    let cast32 = (a + b) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    d = (d + 1) | 0
    cast32 = (cast32 + d) | 0
    c = (c + cast32) | 0
    return (cast32 >>> 0) / 4294967296
  }
}
