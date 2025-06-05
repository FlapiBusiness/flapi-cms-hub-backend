import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName: string = 'application_event_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.integer('project_id').nullable().unsigned().references('id').inTable('projects').onDelete('CASCADE')
      table.enum('action_type', ['CREATE', 'UPDATE', 'DELETE', 'SIGNIN', 'SIGNOUT', 'SIGNUP', 'INVITE']).notNullable()
      table.string('message', 255).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
