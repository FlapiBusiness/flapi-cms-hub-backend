import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUserSessions extends BaseSchema {
  protected tableName = 'user_sessions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unique().notNullable()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('session_state').notNullable() // Stocke l'ID de session Keycloak
      table.string('type').notNullable() // Type de session (ex: Bearer)
      table.string('access_token', 2048).notNullable() // Token d'accès
      table.string('refresh_token', 2048).notNullable() // Token de rafraîchissement
      table.string('issuer').notNullable() // Émetteur du token (ex: https://dev.auth.flapi.org/realms/master)
      table.string('redirect_uri').notNullable() // URI de redirection après connexion (ex: https://dev.hub.flapi.org/dashboard)
      table.timestamp('expires_at').notNullable() // Expiration du token
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
