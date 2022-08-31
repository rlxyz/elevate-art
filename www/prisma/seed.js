const { PrismaClient } = require('@prisma/client')
const { layerConfig: roboghostData } = require('./data/roboghosts')
const { layerConfig: reflectionsData } = require('./data/reflections')

const toPascalCaseWithSpace = (name) => {
  return name
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(/\.[^.]*$/, '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => ` ${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

// const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
const prisma = new PrismaClient()

const cleanDb = async () => {
  try {
    await prisma.rules.deleteMany()
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
          name: toPascalCaseWithSpace(layer.name),
          repositoryId: repository.id,
        },
      })
    })

    Promise.all(layerElements).then((elements) => {
      elements.forEach(async (element) => {
        const total = layerConfig[element.priority].traits.reduce(
          (acc, trait) => acc + trait.weight,
          0
        )
        await prisma.traitElement.createMany({
          data: layerConfig[element.priority].traits.map((trait) => {
            return {
              name: toPascalCaseWithSpace(trait.name),
              weight: (trait.weight / total) * 100,
              layerElementId: element.id,
            }
          }),
        })

        // ret if rule not in a layer
        // if (!layerConfig[element.priority].rules) return

        // layerConfig[element.priority].rules.forEach(async (rule) => {
        //   const { primary, type, links } = rule
        //   const primaryElement = await prisma.traitElement.findFirst({
        //     where: {
        //       name: toPascalCaseWithSpace(primary),
        //       layerElementId: element.id,
        //     },
        //   })

        //   const rules = links.map(async (link) => {
        //     return await prisma.traitElementRule.create({
        //       data: {
        //         type,
        //         traitElementId: primaryElement.id,
        //         linkedTraitElementId: toPascalCaseWithSpace(link),
        //         // layerElementId: element.id,
        //       },
        //     })
        //   })

        //   Promise.all(rules).then((rules) => {
        //     console.log(rules)
        //   })

        //   // await prisma.traitElementRule.createMany({
        //   //   data: {
        //   //     type: toPascalCaseWithSpace(rule.name),
        //   //     description: rule.description,
        //   //     layerElementId: element.id,
        //   //   },
        //   // })
        // })
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
  await main(
    '0xb21B6a39ae2f164357f8e616E30521baECfd7f87',
    'sekured',
    'roboghosts',
    'RoboGhost',
    5555,
    roboghostData
  )
  // await main(
  //   '0x1fdf89Dd0Eba85603CBdE7f9F5cE5D830ffc7643',
  //   'dreamlab',
  //   'reflections',
  //   'Reflection',
  //   1111,
  //   reflectionsData
  // )
})
