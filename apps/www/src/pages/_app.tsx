/** Styles */
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

/** Core Functional Components */
import { ErrorBoundary } from "@highlight-run/react";
import { EthereumAuthenticationLayout } from "src/components/layout/core/EthereumAuthenticationLayout";
import { AnalyticsLayout } from "../components/layout/core/AnalyticsLayout";

/** Types */
import { Session } from "next-auth/core/types";
import { AppType } from "next/app";
import { trpc } from "src/utils/trpc";
import "../utils/highlight";

/** Helpers */
export { reportWebVitals } from "next-axiom";

const Application: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ErrorBoundary showDialog>
      <EthereumAuthenticationLayout session={session}>
        <AnalyticsLayout>
          <Component {...pageProps} />
        </AnalyticsLayout>
      </EthereumAuthenticationLayout>
    </ErrorBoundary>
  );
};

export default trpc.withTRPC(Application);
