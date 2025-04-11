import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      role_id: faker.number.int({ min: 1, max: 6 }), // Assurez-vous d'avoir des IDs valides dans la table user_roles
      lastname: faker.person.lastName(),
      firstname: faker.person.firstName(),
      email: faker.internet.email(),
      currency_code: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', null]), // Choix aléatoire parmi ces devises ou null
      ip_address: faker.internet.ip(),
      ip_region: faker.location.streetAddress(),
      stripe_customer_id: null,
      keycloak_user_id: faker.string.alphanumeric(24), // ID Keycloak simulé (24 caractères alphanumériques)
      created_at: DateTime.fromJSDate(faker.date.recent()),
      updated_at: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .build()
