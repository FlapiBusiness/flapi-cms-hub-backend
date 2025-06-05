import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

/**
 * The Database model represents a database in the application.
 */
export default class Database extends BaseModel {
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  @column()
  // @required @example('my_database')
  declare public name: string

  @column.dateTime({ autoCreate: true })
  // @required @example('2022-01-01T00:00:00.000Z')
  declare public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @required @example('2022-01-01T00:00:00.000Z')
  declare public updated_at: DateTime
}
