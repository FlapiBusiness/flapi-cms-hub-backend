import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('application_name').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('domain_name').notNullable()
      table.integer('file_id').unsigned().references('id').inTable('files')
      table.integer('database_id').unsigned().references('id').inTable('databases')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
