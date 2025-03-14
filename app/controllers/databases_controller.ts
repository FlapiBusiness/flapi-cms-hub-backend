import type { HttpContext } from '@adonisjs/core/http'
import DatabaseService from '#services/database_service'
import type Database from '#models/database'
import type { CreateDatabasePayload, UpdateDatabasePayload } from '#interfaces/database_interface'

/**
 * Controller to handle database operations
 */
export default class DatabasesController {
  /**
   * @create
   * @operationId createDatabase
   * @tag Databases
   * @summary Create a database
   * @description Create a new database
   * @requestBody <CreateDatabasePayload>
   * @content application/json
   * @responseBody 201 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Handle database creation
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const database: CreateDatabasePayload = request.only(['name'])

    await DatabaseService.createDatabase(database.name)

    response.status(201).json({ message: 'Database created successfully' })
  }

  /**
   * @getDatabases
   * @operationId getDatabases
   * @tag Databases
   * @summary Get all databases
   * @description Get all databases
   * @content application/json
   * @responseBody 200 - <Database[]>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Get all databases
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   */
  public async getDatabases({ response }: HttpContext): Promise<void> {
    const databases: Database[] = await DatabaseService.getDatabases()
    response.status(200).json(databases)
  }

  /**
   * @getDatabase
   * @operationId getDatabase
   * @tag Databases
   * @summary Get a database by ID
   * @description Get a database by ID
   * @paramPath id - The ID of the database - @type(number) @required
   * @content  application/json
   * @responseBody 200 - <Database>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Get a database by ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async getDatabase({ response, params }: HttpContext): Promise<void> {
    const database: Database = await DatabaseService.getDatabaseById(params.id)
    response.status(200).json(database)
  }

  /**
   * @updateDatabase
   * @operationId updateDatabase
   * @tag Databases
   * @summary Update a database
   * @description Update a database
   * @paramPath id - The ID of the database - @type(number) @required
   * @requestBody <UpdateDatabasePayload>
   * @content application/json
   * @responseBody 200 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Update a database
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async updateDatabase({ request, response, params }: HttpContext): Promise<void> {
    const database: UpdateDatabasePayload = request.only(['name'])
    await DatabaseService.updateDatabase(params.id, database.name)
    response.status(200).json({ message: 'Database updated successfully' })
  }
  //TODO: Add deleteDatabase method because need to check if a project use this database
  /**
   * @deleteDatabase
   * @operationId deleteDatabase
   * @tag Databases
   * @summary Delete a database
   * @description Delete a database
   * @paramPath id - The ID of the database - @type(number) @required
   * @content application/json
   * @responseBody 200 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Delete a database
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async deleteDatabase({ response, params }: HttpContext): Promise<void> {
    await DatabaseService.deleteDatabase(params.id)
    response.status(200).json({ message: 'Database deleted successfully' })
  }
}
