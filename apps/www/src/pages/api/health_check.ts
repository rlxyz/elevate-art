// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from "@elevateart/auth/src/server/get-server-auth-session";
import { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";
import { env } from "src/env/server.mjs";
import { formatBytes } from "src/utils/format";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  log.debug(`new health check request`, {
    user: session?.user?.id || "anonymous",
  });
  return res.status(200).send({
    header: {
      appName: env.NEXT_PUBLIC_APP_NAME,
      nodeEnv: env.NODE_ENV,
      nextPublicNodeEnv: env.NEXT_PUBLIC_NODE_ENV,
    },
    body: {
      nextAuthUrl: env.NEXTAUTH_URL ? env.NEXTAUTH_URL : process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
      apiUrl: env.NEXT_PUBLIC_API_URL,
      maxImageBytesAllowed: formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED),
    },
  });
};

export default index;
