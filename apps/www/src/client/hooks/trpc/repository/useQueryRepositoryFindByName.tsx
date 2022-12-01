import { NextRouter, useRouter } from "next/router";
import { trpc } from "src/client/utils/trpc";

export const useQueryRepositoryFindByName = () => {
  const router: NextRouter = useRouter();
  const repositoryName: string = router.query.repository as string;
  const { data, isLoading, isError } = trpc.repository.findByName.useQuery({
    name: repositoryName,
  });
  return { current: (data && data) || undefined, isLoading, isError };
};
