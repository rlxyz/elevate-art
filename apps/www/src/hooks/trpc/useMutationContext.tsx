import useRepositoryStore from "src/hooks/store/useRepositoryStore";
import { useNotification } from "src/hooks/utils/useNotification";
import { trpc } from "src/utils/trpc";

export const useMutationContext = () => {
  const ctx = trpc.useContext();
  const repositoryId = useRepositoryStore((state) => state.repositoryId);
  const { notifyError, notifySuccess } = useNotification();
  return { ctx, repositoryId, notifyError, notifySuccess };
};
