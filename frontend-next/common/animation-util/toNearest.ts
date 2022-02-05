export const toNearest = (value: number, step: number) => {
  'worklet'
  return Math.round(value * (1 / step)) / (1 / step)
}

export const floorToNearest = (value: number, step: number) => {
  'worklet'
  return Math.floor(value * (1 / step)) / (1 / step)
}
