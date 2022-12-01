/** Styles */
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

/** Core Functional Components */
import { EthereumAuthenticationLayout } from "@components/layout/core/EthereumAuthenticationLayout";
import { ErrorBoundary } from "@highlight-run/react";
import { AnalyticsLayout } from "../client/components/layout/core/AnalyticsLayout";

/** Types */
import { Session } from "next-auth/core/types";
import { AppType } from "next/app";
import "../client/utils/highlight";

/** Helpers */
import { trpc } from "../client/utils/trpc";
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
