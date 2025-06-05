import factory from '@adonisjs/lucid/factories'
import File from '#models/file'

export const FileFactory = factory
  .define(File, async ({ faker }) => {
    return {
      bucket_id: 1,
      pathfilename: faker.system.fileName(),
      url: faker.internet.url(),
      size: faker.number.int({ min: 1000, max: 100000 }),
    }
  })
  .build()
