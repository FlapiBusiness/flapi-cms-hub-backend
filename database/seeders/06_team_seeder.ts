import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TeamFactory } from '#database/factories/team_factory'

/**
 * Seeder to populate the teams table with dummy data
 * @class TeamSeeder
 */
export default class extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    await TeamFactory.createMany(5)
  }
}
