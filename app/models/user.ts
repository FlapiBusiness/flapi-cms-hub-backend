import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UserRole from '#models/user_role'

/**
 * The User model represents a user of the application.
 */
export default class User extends BaseModel {
  /**
   * The unique identifier for the user.
   */
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  /**
   * The Keycloak user ID associated with the user.
   */
  @column()
  // @required @example('12345678-1234-1234-1234-123456789012')
  declare public keycloakUserId: string

  /**
   * The role ID associated with the user.
   */
  @column()
  // @required @example(1)
  declare public roleId: number

  /**
   * The relationship to the Role model.
   */
  @belongsTo(() => UserRole, {
    foreignKey: 'roleId',
  })
  // @required
  declare public role: BelongsTo<typeof UserRole>

  /**
   * The last name of the user.
   */
  @column()
  // @required @example('Doe')
  declare public lastname: string

  /**
   * The first name of the user.
   */
  @column()
  // @required @example('John')
  declare public firstname: string

  /**
   * The email address of the user. Must be unique.
   */
  @column()
  // @required @example('john-doe@flapi.org')
  declare public email: string

  /**
   * The currency code (e.g., USD, EUR) associated with the user.
   */
  @column()
  // @example('USD')
  declare public currencyCode: string | null

  /**
   * The user's IP address.
   */
  @column()
  // @example('0.0.0.0')
  declare public ipAddress: string | null

  /**
   * The region of the IP address associated with the user.
   */
  @column()
  // @example('FR')
  declare public ipRegion: string | null

  /**
   * The Stripe customer ID associated with the user.
   */
  @column()
  // @example(12345678)
  declare public stripeCustomerId: number | null

  /**
   * The timestamp when the user was created.
   */
  @column.dateTime({ autoCreate: true })
  // @required @example('2022-01-01T12:00:00.000Z')
  declare public createdAt: DateTime

  /**
   * The timestamp when the user was last updated.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @example('2022-01-01T12:00:00.000Z')
  declare public updatedAt: DateTime | null
}
