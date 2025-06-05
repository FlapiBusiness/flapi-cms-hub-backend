// app/Models/ApplicationEventLog.ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Project from '#models/project'

/**
 * The ApplicationEventLog model represents an event log in the application.
 */
export default class ApplicationEventLog extends BaseModel {
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  @column()
  // @example(1)
  declare public user_id: number | null

  @column()
  // @example (1)
  declare public project_id: number | null

  @column()
  // @enum(CREATE, UPDATE, DELETE, SIGNIN, SIGNOUT, SIGNUP, INVITE) @required @example('CREATE')
  declare public action_type: string

  @column()
  // @required @example('Message')
  declare public message: string

  @column.dateTime({ autoCreate: true })
  // @required @example('2021-01-01T00:00:00.000Z')
  declare public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @required @example('2021-01-01T00:00:00.000Z')
  declare public updated_at: DateTime

  /**
   * The relationship to the User model.
   */
  @belongsTo((): typeof User => User, {
    foreignKey: 'user_id',
  })
  declare public user: BelongsTo<typeof User>

  /**
   * The relationship to the Project model.
   */
  @belongsTo((): typeof Project => Project, {
    foreignKey: 'project_id',
  })
  declare public project: BelongsTo<typeof Project>
}
