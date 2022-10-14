// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from 'next'

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = req.query.name as string
  return await prisma?.repository.findFirst({
    where: { name },
  })
}

export default restricted
