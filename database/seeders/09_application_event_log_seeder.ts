import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ApplicationEventLogFactory } from '#database/factories/application_event_log_factory'
import User from '#models/user'
import Project from '#models/project'

/**
 * Seeder to populate the application_event_logs table with dummy data
 * @class ApplicationEventLogSeeder
 */
export default class extends BaseSeeder {
  /**
   * Run the seeder
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async run(): Promise<void> {
    const userIds: number[] = (await User.all()).map((user: User): number => user.id)
    const projectIds: number[] = (await Project.all()).map((project: Project): number => project.id)

    if (userIds.length === 0) {
      console.log("Aucun utilisateur trouvé, le seeder Team ne peut pas assigner d'owner_id.")
      return
    }

    // Create 20 application event logs
    await ApplicationEventLogFactory.merge({
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      project_id: projectIds[Math.floor(Math.random() * projectIds.length)],
    }).createMany(20)
  }
}
