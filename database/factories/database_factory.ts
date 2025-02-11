import factory from '@adonisjs/lucid/factories'
import Database from '#models/database'

export const DatabaseFactory = factory
  .define(Database, async ({ faker }) => {
    return {
      name: faker.company.name(),
    }
  })
  .build()
