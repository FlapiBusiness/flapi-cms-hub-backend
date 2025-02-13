// app/Models/Team.ts
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Project from '#models/project'

/**
 * The Team model represents a team in the application.
 */
export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public description: string | undefined

  @column()
  declare public owner_id: number

  @belongsTo(() => User, { foreignKey: 'owner_id' })
  declare public owner: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /**
   * Relation many-to-many avec les utilisateurs via la table pivot 'user_team'
   */
  @manyToMany(() => User, {
    pivotTable: 'user_teams',
    pivotColumns: ['role'],
  })
  declare public users: ManyToMany<typeof User>

  /**
   * Relation many-to-many avec les projets via la table pivot 'team_project'
   */
  @manyToMany(() => Project, {
    pivotTable: 'team_projects',
  })
  declare public projects: ManyToMany<typeof Project>
}
