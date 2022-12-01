import produce from "immer";
import { trpc } from "src/utils/trpc";
import { useMutationContext } from "../useMutationContext";

export const useMutateRuleDelete = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext();
  return trpc.rule.delete.useMutation({
    onSuccess: (data) => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old;
        const next = produce(old, (draft) => {
          const allTraitElements = draft.flatMap((x) => x.traitElements);

          /** Get the Traits */
          const primary = allTraitElements.find((l) => l.id === data.primaryTraitElementId);
          const secondary = allTraitElements.find((l) => l.id === data.secondaryTraitElementId);
          if (typeof primary === "undefined" || typeof secondary === "undefined") return;

          /** Find the index of the rules in their assocaited TraitElement */
          const ruleIndexPrimary = primary.rulesPrimary.findIndex((r) => r.id === data.id);
          const ruleIndexSecondary = secondary.rulesSecondary.findIndex((r) => r.id === data.id);
          if (ruleIndexPrimary < 0 || ruleIndexSecondary < 0) return;

          /** Remove rule  */
          primary.rulesPrimary.splice(ruleIndexPrimary, 1);
          secondary.rulesSecondary.splice(ruleIndexSecondary, 1);

          notifySuccess(`Deleted ${primary.name} ${data.condition} ${secondary.name} rule`);
        });
        return next;
      });
    },
    onError: () => {
      notifyError("We couldn't delete the rule. Try again...");
    },
  });
};
