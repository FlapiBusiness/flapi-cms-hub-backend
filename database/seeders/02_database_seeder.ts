import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DatabaseFactory } from '#database/factories/database_factory'

/**
 * Seeder to populate the databases table with dummy data
 * @class DatabaseSeeder
 */
export default class DatabaseSeeder extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    await DatabaseFactory.createMany(10)
  }
}
