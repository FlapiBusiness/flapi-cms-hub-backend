import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'team_projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('team_id').unsigned().notNullable()
      table.integer('project_id').unsigned().notNullable()

      table.primary(['team_id', 'project_id'])

      table.foreign('team_id').references('id').inTable('teams').onDelete('CASCADE')
      table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
