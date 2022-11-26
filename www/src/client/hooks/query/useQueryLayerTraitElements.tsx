import { trpc } from '@utils/trpc'

export const useQueryLayerTraitElements = ({ id }: { id: string }) => {
  const { data: traits, isLoading, isError } = trpc.useQuery(['layers.traits.find', { id }], { enabled: !!id })
  return {
    all: traits?.traitElements,
    isLoading,
    isError,
  }
}
