import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName: string = 'project_setups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL')
      table
        .enum('step', [
          'SETUP_STARTED',
          'VERIFY_SUBDOMAINS',
          'CREATE_SUBDOMAINS',
          'CREATE_DATABASE',
          'CREATE_REPOSITORIES',
          'DEPLOYMENT',
          'SETUP_DONE',
          'SETUP_FAILED',
        ])
        .notNullable()
      table.enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).notNullable()
      table.string('message', 255).nullable()
      table.timestamp('started_at').defaultTo(this.now()).notNullable()
      table.timestamp('ended_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
