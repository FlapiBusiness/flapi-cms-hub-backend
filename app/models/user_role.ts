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
  declare public id: number

  /**
   * Le nom du rôle.
   */
  @column()
  declare public name: string

  /**
   * La date de création du rôle.
   */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  /**
   * La date de mise à jour du rôle.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime | null
}
