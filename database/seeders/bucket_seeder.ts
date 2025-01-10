import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Bucket from '#models/bucket'

/**
 * Seeder to populate the buckets table with the default buckets
 * @class BucketSeeder
 */
export default class BucketSeeder extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    // Write your database queries inside the run method
    const bucketsData: { name: string; visibility: string }[] = [
      { name: 'flapi-public', visibility: 'public' },
      { name: 'flapi-private', visibility: 'private' },
    ]
    for (const data of bucketsData) {
      await Bucket.firstOrCreate(data)
    }
  }
}
