import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      roleId: faker.number.int({ min: 1, max: 5 }), // Assurez-vous d'avoir des IDs valides dans la table user_roles
      lastname: faker.person.lastName(),
      firstname: faker.person.firstName(),
      email: faker.internet.email(),
      password: 'Toto35!!!', // Mot de passe par défaut hashé
      currencyCode: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', null]), // Choix aléatoire parmi ces devises ou null
      ipAddress: faker.internet.ip(),
      ipRegion: faker.location.streetAddress(),
      isActive: faker.datatype.boolean(),
      activeCode: faker.number.int({ min: 100000, max: 999999 }), // Code numérique à 6 chiffres
      stripeCustomerId: null, // ID client Stripe aléatoire
      keycloak_user_id: faker.number.int({ min: 100000, max: 999999 }), // ID utilisateur Keycloak aléatoire
      createdAt: DateTime.fromJSDate(faker.date.recent()),
      updatedAt: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .build()
