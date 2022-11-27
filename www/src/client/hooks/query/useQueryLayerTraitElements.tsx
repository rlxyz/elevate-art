import { trpc } from 'src/client/utils/trpc'

export const useQueryLayerTraitElements = ({ id }: { id: string }) => {
  const { data: traits, isLoading, isError } = trpc.layerElement.findAllTraitElements.useQuery({ layerElementId: id }, { enabled: !!id })
  return {
    all: traits?.traitElements,
    isLoading,
    isError,
  }
}
