import { getTraitElementImage } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  // r: repositoryId, l: layerElementId, t: traitElementId
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  const layerElements = await prisma?.layerElement.findMany({
    where: { repository: { name: repositoryName, organisation: { name: organisationName } } },
    orderBy: [{ priority: 'asc' }],
    include: {
      traitElements: {
        orderBy: [{ weight: 'desc' }, { name: 'asc' }],
        include: {
          rulesPrimary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
          rulesSecondary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
        },
      },
    },
  })

  const repository = await prisma?.repository.findFirst({
    where: { name: repositoryName, organisation: { name: organisationName } },
  })

  if (!layerElements || !repository) {
    return res.status(404).send('Not Found')
  }

  const tokens = v.one(
    v.parseLayer(
      layerElements
        .sort((a, b) => a.priority - b.priority)
        .map((l) => ({
          ...l,
          traits: l.traitElements.map((t) => ({
            ...t,
            rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
              ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
                type: condition as v.RulesType,
                with: left === t.id ? right : left,
              })
            ),
          })),
        }))
    ),
    v.seed(seed, id)
  )

  const canvas = new Canvas(600, 600)

  await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Canvas>(async (resolve, reject) => {
        const response = await getTraitElementImage({ r: repository.id, l, t })
        if (response.failed) return reject()
        const blob = response.getValue()
        if (!blob) return reject()
        return resolve(canvas.printImage(await resolveImage(Buffer.from(await blob.arrayBuffer())), 0, 0, 600, 600))
      })
    })
  ).then(() => {
    const buf = canvas.toBuffer('image/png')
    return res.setHeader('Content-Type', 'image/png').send(buf)
  })
}

export default index
