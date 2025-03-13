import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      roleId: faker.number.int({ min: 1, max: 6 }), // Assurez-vous d'avoir des IDs valides dans la table user_roles
      lastname: faker.person.lastName(),
      firstname: faker.person.firstName(),
      email: faker.internet.email(),
      currencyCode: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', null]), // Choix aléatoire parmi ces devises ou null
      ipAddress: faker.internet.ip(),
      ipRegion: faker.location.streetAddress(),
      stripeCustomerId: null,
      keycloakUserId: faker.string.alphanumeric(24), // ID Keycloak simulé (24 caractères alphanumériques)
      createdAt: DateTime.fromJSDate(faker.date.recent()),
      updatedAt: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .build()
