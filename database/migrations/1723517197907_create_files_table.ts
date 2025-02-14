import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('bucket_id').unsigned().references('id').inTable('buckets').notNullable()
      table.string('pathfilename').notNullable()
      table.string('url').notNullable()
      table.integer('size').notNullable() // in bytes
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
