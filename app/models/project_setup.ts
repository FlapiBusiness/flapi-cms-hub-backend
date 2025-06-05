import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'

/**
 * The ProjectSetup model represents the setup process of a project.
 */
export default class ProjectSetup extends BaseModel {
  /**
   * The unique identifier for the project setup.
   */
  @column({ isPrimary: true })
  // @required @example(1)
  declare public id: number

  /**
   * The ID of the project associated with the setup.
   */
  @column()
  // @required @example(1)
  declare public project_id: number

  /**
   * The ID of the user associated with the setup.
   */
  @column()
  // @enum(SETUP_STARTED, VERIFY_SUBDOMAINS, CREATE_SUBDOMAINS, CREATE_DATABASE, CREATE_REPOSITORIES, DEPLOYMENT, SETUP_DONE, SETUP_FAILED) @required @example('SETUP_STARTED')
  declare public step: string

  /**
   * The status of the project setup.
   */
  @column()
  // @enum(PENDING, IN_PROGRESS, COMPLETED, FAILED) @required @example('PENDING')
  declare public status: string

  /**
   * The message associated with the project setup.
   */
  @column()
  // @example('Setup in progress')
  declare public message: string | null

  /**
   * The relationship to the Project model.
   */
  @belongsTo((): typeof Project => Project, {
    foreignKey: 'project_id',
  })
  declare public project: BelongsTo<typeof Project>

  /**
   * The timestamp when the project setup was created.
   */
  @column.dateTime()
  // @required @example('2021-01-01T00:00:00.000Z')
  declare public started_at: DateTime

  /**
   * The timestamp when the project setup was ended.
   */
  @column.dateTime()
  // @example('2021-01-01T00:00:00.000Z')
  declare public ended_at: DateTime | null
}
