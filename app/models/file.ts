import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Bucket from '#models/bucket'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * The File model represents a file in the application.
 */
export default class File extends BaseModel {
  /**
   * The unique identifier for the file.
   */
  @column({ isPrimary: true })
  declare public id: number

  /**
   * The ID of the bucket associated with the file.
   */
  @column()
  declare public bucket_id: number

  /**
   * The relationship to the Bucket model.
   */
  @belongsTo((): typeof Bucket => Bucket, {
    foreignKey: 'bucket_id',
  })
  declare public bucket: BelongsTo<typeof Bucket>

  /**
   * The path and filename of the file.
   */
  @column()
  declare public pathfilename: string

  /**
   * The URL of the file.
   */
  @column()
  declare public url: string

  /**
   * The size of the file in bytes.
   */
  @column()
  declare public size: number

  /**
   * The timestamp when the file was created.
   */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  /**
   * The timestamp when the file was last updated.
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
