export const DEFAULT_ALCHEMY_KEY = 'CMSJqNTL85ds3C2VslvAA3H16HSgoChH'
export const ALCHEMY_MAINNET_KEYS = [
  'CMSJqNTL85ds3C2VslvAA3H16HSgoChH',
  'wPBDyu09SaqHBOoJTMFLkRSzjBjIUnQQ',
  'yG_F19_sVzOdyX44q2d6DukrLoQUTlXU',
  'iO9STXzufmmz1JMfOikXkO6ZYdhWyQtx',
  'llFyryxwhn-wXm2eILsQ2Awj1OehKE-I',
  'm_jWoYFYQ524yVUexvl96HdFgvBGgbIY',
  'GTA-_K-8AVGsTR05AHk2bidV214NaJSM',
]

export const getRandomAlchemyKey = () =>
  ALCHEMY_MAINNET_KEYS[Math.floor(Math.random() * ALCHEMY_MAINNET_KEYS.length)] || DEFAULT_ALCHEMY_KEY
