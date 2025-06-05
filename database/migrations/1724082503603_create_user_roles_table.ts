import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table
        .enum('name', [
          'SUPER_ADMIN_FLAPI',
          'ADMIN_CLIENT',
          'APP_MANAGER_CLIENT',
          'MARKETING_CLIENT',
          'SUPPORT_CLIENT',
          'COMMERCIAL_CLIENT',
        ])
        .notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
