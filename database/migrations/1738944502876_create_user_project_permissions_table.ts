import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_project_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.integer('project_id').unsigned().notNullable()
      table.boolean('has_access').notNullable().defaultTo(false)

      table.primary(['user_id', 'project_id'])

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('project_id').references('id').inTable('projects').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
