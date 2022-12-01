import { H } from "highlight.run";
import { env } from "src/env/client.mjs";

if (
  env.NEXT_PUBLIC_NODE_ENV === "production" &&
  env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID !== ""
) {
  H.init(env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
    environment: env.NEXT_PUBLIC_NODE_ENV,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    // version: (process.env.VERCEL_GIT_COMMIT_SHA as string) || env.NEXT_PUBLIC_NODE_ENV, // default to production
    // enableStrictPrivacy: false, see: https://docs.highlight.run/privacy#pU2Cn
  });
}
