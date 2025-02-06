import Database from '#models/database'
import logger from '@adonisjs/core/services/logger'

/**
 * Service to handle database operations
 */
export default class DatabaseService {
  /**
   * Create a new database
   * @param {string} database_name - Name of the database
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async createDatabase(database_name: string): Promise<void> {
    try {
      await Database.create({
        name: database_name,
      })
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Get all databases
   * @returns {Promise<Database[]>} - A promise that resolves with an array of databases
   */
  public static async getDatabases(): Promise<Database[]> {
    try {
      return await Database.all()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Get a database by ID
   * @param {number} id - The database ID
   * @returns {Promise<Database>} - A promise that resolves with a database
   */
  public static async getDatabaseById(id: number): Promise<Database> {
    try {
      return await Database.findOrFail(id)
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Update a database
   * @param {number} id - The database ID
   * @param {string} database_name - Name of the database
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async updateDatabase(id: number, database_name: string): Promise<void> {
    try {
      const db: Database = await Database.findOrFail(id)
      db.name = database_name
      await db.save()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Delete a database
   * @param {number} id - The database ID
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async deleteDatabase(id: number): Promise<void> {
    try {
      const db: Database = await Database.findOrFail(id)
      await db.delete()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}
