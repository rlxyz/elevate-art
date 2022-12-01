import produce from "immer";
import { trpc } from "src/utils/trpc";
import { useMutationContext } from "../useMutationContext";

export const useMutateTraitElementUpdateName = () => {
  const { ctx, repositoryId, notifyError } = useMutationContext();
  return trpc.traitElement.updateName.useMutation({
    onSuccess: (_, variable) => {
      const { traitElements } = variable;
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old;
        produce(old, (draft) => {
          const allTraits = draft.flatMap((x) => x.traitElements);
          traitElements.forEach(({ traitElementId, name }) => {
            const trait = allTraits.find((x) => x.id === traitElementId);
            if (!trait) return;
            trait.name = name;
          });
        });
      });
    },
    onError: (err, variables, context) => {
      notifyError("Something went wrong when renaming the trait. Try again...");
    },
  });
};
