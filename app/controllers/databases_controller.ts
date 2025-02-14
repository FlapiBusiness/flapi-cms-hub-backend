// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import DatabaseService from '#services/database_service'
import type Database from '#models/database'

/**
 * Controller to handle database operations
 */
export default class DatabasesController {
  /**
   * Handle database creation
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const database_name: string = request.input('name')

    await DatabaseService.createDatabase(database_name)

    response.status(201).json({ message: 'Database created successfully' })
  }

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
   * Update a database
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async updateDatabase({ request, response, params }: HttpContext): Promise<void> {
    const database_name: string = request.input('name')
    await DatabaseService.updateDatabase(params.id, database_name)
    response.status(200).json({ message: 'Database updated successfully' })
  }
  //TODO: Add deleteDatabase method because need to check if a project use this database
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
