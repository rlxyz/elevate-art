
export const formatLayerName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/(\s+)/g, '-')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};
