import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { FileFactory } from '#database/factories/file_factory'

/**
 * Seeder to populate the files table with dummy data
 * @class FileSeeder
 */
export default class extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    await FileFactory.createMany(10)
  }
}
