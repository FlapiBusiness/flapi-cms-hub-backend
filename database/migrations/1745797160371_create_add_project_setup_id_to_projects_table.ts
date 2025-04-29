import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName: string = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('project_setup_id').unsigned().nullable().references('id').inTable('project_setups')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('project_setup_id')
    })
  }
}
