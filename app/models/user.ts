import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UserRole from '#models/user_role'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

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
   * The role ID associated with the user.
   */
  @column()
  declare public roleId: number

  /**
   * The relationship to the Role model.
   */
  @belongsTo(() => UserRole)
  declare public role: BelongsTo<typeof UserRole>

  /**
   * The last name of the user.
   */
  @column()
  declare public lastname: string | null

  /**
   * The first name of the user.
   */
  @column()
  declare public firstname: string | null

  /**
   * The email address of the user. Must be unique.
   */
  @column()
  declare public email: string

  /**
   * The hashed password of the user.
   * This field is hidden in serialized responses.
   */
  @column({ serializeAs: null })
  declare public password: string

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
   * Whether the user account is active.
   */
  @column()
  declare public isActive: boolean

  /**
   * The 6-digit active code for the user.
   */
  @column()
  declare public activeCode: number

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
  declare public updatedAt: DateTime

  public static accessTokens = DbAccessTokensProvider.forModel(User)

  /**
   * Hook to hash the password before saving it to the database.
   * @param {User} user - The user instance to hash the password for.
   */
  @beforeSave()
  public static async hashPassword(user: User): Promise<void> {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
