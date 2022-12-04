/** Styles */
import "@rainbow-me/rainbowkit/styles.css";
import "react-medium-image-zoom/dist/styles.css";
import "../styles/globals.css";

/** Core Functional Components */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Helpers */
import LogRocket from "logrocket";
import { AppType } from "next/app";
import { useEffect } from "react";
import { config } from "src/utils/config";
import { trpc } from "src/utils/trpc";

const queryClient = new QueryClient();

const Application: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    LogRocket.init(config.logrocketKey);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(Application);
