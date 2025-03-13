import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_teams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.integer('team_id').unsigned().notNullable()
      table.string('role', 50).notNullable().defaultTo('member')

      table.primary(['user_id', 'team_id'])

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('team_id').references('id').inTable('teams').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
