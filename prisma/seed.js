const { PrismaClient } = require('@prisma/client')
const { layerConfig: roboghostData } = require('./data/roboghosts')
const { layerConfig: reflectionsData } = require('./data/reflections')
const formatLayerName = (name) => {
  return name
    .toLowerCase()
    .replace(/(\s+)/g, '-')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
    .replace('.png', '')
}

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

const cleanDb = async () => {
  try {
    await prisma.artElement.deleteMany()
    await prisma.traitElement.deleteMany()
    await prisma.layerElement.deleteMany()
    await prisma.collection.deleteMany()
    await prisma.repository.deleteMany()
    await prisma.organisation.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const main = async (
  address,
  organisationName,
  repositoryName,
  tokenName,
  totalSupply,
  layerConfig
) => {
  try {
    const userData = {
      address: address,
    }
    const user = await prisma.user.create({ data: userData })

    const organisationData = {
      name: organisationName,
      ownerId: user.id,
    }

    const organisation = await prisma.organisation.create({
      data: {
        ...organisationData,
      },
    })

    const repositoryData = {
      name: repositoryName,
      tokenName: tokenName,
      organisationId: organisation.id,
    }
    const repository = await prisma.repository.create({ data: repositoryData })

    const layerElements = layerConfig.map(async (layer, index) => {
      return await prisma.layerElement.create({
        data: {
          priority: index,
          name: layer.name,
          repositoryId: repository.id,
        },
      })
    })

    Promise.all(layerElements).then((elements) => {
      elements.forEach(async (element) => {
        await prisma.traitElement.createMany({
          data: layerConfig[element.priority].traits.map((trait) => {
            return {
              name: formatLayerName(trait.name),
              weight: trait.weight,
              layerElementId: element.id,
            }
          }),
        })
      })
    })

    // creating main branch
    await prisma.collection.create({
      data: {
        repositoryId: repository.id,
        totalSupply: 5555,
      },
    })

    // creating second branch
    await prisma.collection.create({
      data: {
        name: 'development',
        repositoryId: repository.id,
        totalSupply: totalSupply,
      },
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDb().then(async () => {
  console.log('adding roboghost')
  await main(
    '0xb21B6a39ae2f164357f8e616E30521baECfd7f87',
    'sekured.eth',
    'roboghosts',
    'RoboGhost',
    5555,
    roboghostData
  )
  console.log('adding dreamlab')
  await main(
    '0x1fdf89Dd0Eba85603CBdE7f9F5cE5D830ffc7643',
    'dreamlab.eth',
    'reflections',
    'Reflection',
    1111,
    reflectionsData
  )
})
