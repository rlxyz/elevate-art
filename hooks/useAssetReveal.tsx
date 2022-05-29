import { useQueries } from "react-query";

const fetchImageAsset = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/reflection/${id}`,
    {
      method: "GET",
    }
  );

  return response.json();
};

interface UseAssetReveal {
  isLoading: boolean;
  data: { name: string; image: string }[];
}

export const useAssetReveal = (
  address: string,
  tokenIds: number[] = []
): UseAssetReveal => {
  const results = useQueries(
    tokenIds.map((id) => {
      return {
        queryKey: [`asset-${address}`, id],
        queryFn: () => fetchImageAsset(id),
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
        retryDelay: 5000,
        enabled: !!id && address !== "",
      };
    })
  );

  return {
    isLoading: results.filter((result) => result.isLoading).length > 0,
    data:
      tokenIds.length > 0 && !!address
        ? results
            .map((result) => ({
              image: result.data?.image,
              name: result.data?.name,
            }))
            .filter((x) => !!x)
            .sort()
        : [],
  };
};
