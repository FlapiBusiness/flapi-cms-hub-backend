import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * Modèle représentant les rôles des utilisateurs.
 */
export default class UserRole extends BaseModel {
  /**
   * L'identifiant unique du rôle.
   */
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  /**
   * Le nom du rôle.
   */
  @column()
  // @enum(SUPER_ADMIN_FLAPI, ADMIN_CLIENT, APP_MANAGER_CLIENT, MARKETING_CLIENT, SUPPORT_CLIENT, COMMERCIAL_CLIENT) @required @example('MARKETING_CLIENT')
  declare public name: string

  /**
   * La date de création du rôle.
   */
  @column.dateTime({ autoCreate: true })
  // @required @example('2021-01-01T00:00:00.000Z')
  declare public created_at: DateTime

  /**
   * La date de mise à jour du rôle.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @example('2021-01-01T00:00:00.000Z')
  declare public updated_at: DateTime | null
}
