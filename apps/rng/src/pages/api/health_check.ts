// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).send({
    header: {
      appName: env.NEXT_PUBLIC_APP_NAME,
      nodeEnv: env.NODE_ENV,
      nextPublicNodeEnv: env.NEXT_PUBLIC_NODE_ENV,
    },
    body: {},
  });
};

export default index;
