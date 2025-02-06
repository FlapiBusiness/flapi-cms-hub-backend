import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import File from '#models/file'
import Database from '#models/database'

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
  declare public applicationName: string

  /**
   * The ID of the user associated with the project.
   */
  @column()
  declare public userId: number

  /**
   * The relationship to the User model.
   */
  @belongsTo((): typeof User => User, {
    foreignKey: 'userId',
  })
  declare public user: BelongsTo<typeof User>

  /**
   * The domain name of the project.
   */
  @column()
  declare public domainName: string

  /**
   * The ID of the file associated with the project.
   */
  @column()
  declare public fileId: number

  /**
   * The relationship to the File model.
   */
  @belongsTo((): typeof File => File)
  declare public file: BelongsTo<typeof File>

  /**
   * The ID of the database associated with the project.
   */
  @column()
  declare public databaseId: number

  /**
   * The relationship to the Database model.
   */
  @belongsTo((): typeof Database => Database)
  declare public database: BelongsTo<typeof Database>

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
