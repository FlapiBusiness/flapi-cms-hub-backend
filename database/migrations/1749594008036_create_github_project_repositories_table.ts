import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName: string = 'github_project_repositories'

  async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id')
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE')
      table.string('repo_name').notNullable()
      table.string('repo_url').notNullable()
      table.enum('type', ['frontend', 'backend']).notNullable()
      table.boolean('deployed').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
