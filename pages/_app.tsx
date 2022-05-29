import "../styles/globals.scss";
import "react-medium-image-zoom/dist/styles.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { useStore } from "@hooks/useStore";
import { WalletProvider } from "@hooks/useWallet";
import { Layout } from "@components/Layout/Layout";
import { Token } from "state/token"; // Token state provider
import { rollbar } from "@utils/rollbar";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

interface AppPropsWithError extends AppProps {
  err: unknown;
}

function CustomApp({
  Component,
  pageProps = { title: "index" },
  err,
}: AppPropsWithError) {
  const router = useRouter();

  useEffect(() => {
    useStore.setState({ router, rollbar });
  }, [router]);

  useEffect(() => {
    import("flowbite");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Token.Provider>
          <Layout>
            <Component {...pageProps} err={err} />
            <Toaster />
          </Layout>
        </Token.Provider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default CustomApp;
