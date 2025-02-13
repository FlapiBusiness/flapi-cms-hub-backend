import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TeamFactory } from '#database/factories/team_factory'
import User from '#models/user'

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
    const userIds: number[] = (await User.all()).map((user: User) => user.id)

    if (userIds.length === 0) {
      console.log("Aucun utilisateur trouvé, le seeder Team ne peut pas assigner d'owner_id.")
      return
    }

    // Créer 5 équipes en assignant aléatoirement un owner_id parmi les utilisateurs existants
    await TeamFactory.merge({
      owner_id: userIds[Math.floor(Math.random() * userIds.length)],
    }).createMany(5)
  }
}
