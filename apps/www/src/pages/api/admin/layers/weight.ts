import { getLayerElementsWithTraitElementsTotalWeight } from "@elevateart/api/src/common/get-all-layer-elements-total-weight";
import { getServerAuthSession } from "@elevateart/auth/src/server/get-server-auth-session";
import { NextApiRequest, NextApiResponse } from "next";
const admins = new Map<string, boolean>([
  ["0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608", true],
  ["0xd2a08007eeeaf1f81eeF54Ba6A8c4Effa1e545C6", true],
]);

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!prisma) return res.status(400);

  const session = await getServerAuthSession({ req, res });
  if (!session) return res.status(400);

  const address = session?.user?.address;
  if (!address) return res.status(400);

  const isAdmin = admins.has(address);
  if (!isAdmin) return res.status(400);

  const response = await getLayerElementsWithTraitElementsTotalWeight({
    prisma,
  });
  return res.status(200).json(response);
};

export default index;
