import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'

/**
 * Seeder to populate the users table with dummy data
 * @class UserSeeder
 */
export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    await UserFactory.createMany(20)
  }
}
