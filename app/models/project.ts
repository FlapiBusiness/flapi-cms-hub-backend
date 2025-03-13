import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import File from '#models/file'
import Database from '#models/database'
import Team from '#models/team'

/**
 * The Project model represents a project in the application.
 */
export default class Project extends BaseModel {
  /**
   * The unique identifier for the project.
   */
  @column({ isPrimary: true })
  declare public id: number

  /**
   * The name of the application.
   */
  @column()
  declare public application_name: string

  /**
   * The ID of the user associated with the project.
   */
  @column()
  declare public user_id: number

  /**
   * The relationship to the User model.
   */
  @belongsTo((): typeof User => User, {
    foreignKey: 'user_id',
  })
  declare public user: BelongsTo<typeof User>

  /**
   * The domain name of the project.
   */
  @column()
  declare public domain_name: string

  /**
   * The ID of the file associated with the project.
   */
  @column()
  declare public file_id: number

  /**
   * The relationship to the File model.
   */
  @belongsTo((): typeof File => File, {
    foreignKey: 'file_id',
  })
  declare public file: BelongsTo<typeof File>

  /**
   * The ID of the database associated with the project.
   */
  @column()
  declare public database_id: number

  /**
   * The relationship to the Database model.
   */
  @belongsTo((): typeof Database => Database, {
    foreignKey: 'database_id',
  })
  declare public database: BelongsTo<typeof Database>

  /**
   * Relation many-to-many avec les équipes via la table pivot 'team_project'
   */
  @manyToMany(() => Team, {
    pivotTable: 'team_projects',
  })
  declare public teams: ManyToMany<typeof Team>

  /**
   * Relation many-to-many avec les utilisateurs via la table pivot 'user_project_permissions'
   * Récupère la colonne 'has_access' pour définir l'accès de l'utilisateur au projet.
   */
  @manyToMany(() => User, {
    pivotTable: 'user_project_permissions',
    pivotColumns: ['has_access'],
  })
  declare public user_permissions: ManyToMany<typeof User>

  /**
   * The timestamp when the project was created.
   */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  /**
   * The timestamp when the project was last updated.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
