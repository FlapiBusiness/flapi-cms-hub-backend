import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table.integer('keycloak_user_id').notNullable().unique()
      table.integer('role_id').unsigned().references('id').inTable('user_roles').notNullable()
      table.string('lastname').notNullable()
      table.string('firstname').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('currency_code').nullable()
      table.string('ip_address', 45).nullable()
      table.string('ip_region', 45).nullable()
      table.boolean('is_active').defaultTo(false)
      table.integer('active_code', 6).notNullable()
      table.integer('stripe_customer_id').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
