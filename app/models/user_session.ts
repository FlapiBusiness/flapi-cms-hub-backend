import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * Le modèle UserSession représente une session utilisateur.
 */
export default class UserSession extends BaseModel {
  /**
   * L'identifiant unique de la session.
   */
  @column({ isPrimary: true })
  declare public id: number

  /**
   * L'URL de l'émetteur du jeton.
   * @example https://dev.auth.flapi.org/realms/master
   */
  @column()
  declare public issuer: string

  /**
   * L'URI de redirection après une connexion réussi de l'utilisateur.
   * @example https://dev.hub.flapi.org/dashboard
   */
  @column()
  declare public redirectUri: string

  /**
   * L'état de session Keycloak.
   */
  @column()
  declare public sessionState: string

  /**
   * Le type de jeton.
   * @example Bearer
   */
  @column()
  declare public type: string

  /**
   * Le jeton d'accès.
   */
  @column()
  declare public accessToken: string

  /**
   * Le jeton de rafraîchissement.
   */
  @column()
  declare public refreshToken: string

  /**
   * L'expiration du jeton.
   */
  @column.dateTime()
  declare public expiresAt: DateTime

  /**
   * L'identifiant de l'utilisateur associé à la session.
   */
  @column()
  declare public userId: number

  /**
   * La relation avec le modèle
   */
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare public user: BelongsTo<typeof User>

  /**
   * La date de création de la session.
   */
  @column.dateTime({ autoCreate: true })
  declare public created_at: DateTime

  /**
   * La date de mise à jour de la session.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updated_at: DateTime
}
