import LogRocket from "logrocket";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const HomeView = dynamic(
  () => import("@components/Pages/Home").then((mod) => mod.Home),
  {
    ssr: false,
  }
);

export const HomePage = () => {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address);
    }
  }, [account?.address]);

  return <HomeView />;
};

export default HomePage;
