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
  declare public id: number

  /**
   * The Keycloak user ID associated with the user.
   */
  @column()
  declare public keycloakUserId: string

  /**
   * The role ID associated with the user.
   */
  @column()
  declare public roleId: number

  /**
   * The relationship to the Role model.
   */
  @belongsTo(() => UserRole, {
    foreignKey: 'roleId',
  })
  declare public role: BelongsTo<typeof UserRole>

  /**
   * The last name of the user.
   */
  @column()
  declare public lastname: string

  /**
   * The first name of the user.
   */
  @column()
  declare public firstname: string

  /**
   * The email address of the user. Must be unique.
   */
  @column()
  declare public email: string

  /**
   * The currency code (e.g., USD, EUR) associated with the user.
   */
  @column()
  declare public currencyCode: string | null

  /**
   * The user's IP address.
   */
  @column()
  declare public ipAddress: string | null

  /**
   * The region of the IP address associated with the user.
   */
  @column()
  declare public ipRegion: string | null

  /**
   * The Stripe customer ID associated with the user.
   */
  @column()
  declare public stripeCustomerId: number | null

  /**
   * The timestamp when the user was created.
   */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  /**
   * The timestamp when the user was last updated.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime | null
}
