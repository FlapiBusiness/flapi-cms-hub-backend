import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await UserFactory.createMany(20)
  }
}
