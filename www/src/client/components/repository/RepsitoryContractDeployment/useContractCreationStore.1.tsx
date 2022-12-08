import create from 'zustand'

export const useContractCreationStore = create<{
  currentSegment: number
  setCurrentSegment: (segment: number) => void
}>((set) => ({
  currentSegment: 0,
  setCurrentSegment: (segment: number) => set({ currentSegment: segment }),
}))
