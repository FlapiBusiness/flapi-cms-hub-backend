import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ProjectFactory } from '#database/factories/project_factory'
import Database from '#models/database'
import User from '#models/user'
import File from '#models/file'

/**
 * Seeder to populate the projects table with dummy data
 * @class ProjectSeeder
 */
export default class extends BaseSeeder {
  /**
   * Run the seeder
   */
  public async run(): Promise<void> {
    const userIds: number[] = (await User.all()).map((user: User) => user.id)
    const fileIds: number[] = (await File.all()).map((file: File) => file.id)
    const databaseIds: number[] = (await Database.all()).map((database: Database) => database.id)

    await ProjectFactory.merge({
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      file_id: fileIds[Math.floor(Math.random() * fileIds.length)],
      database_id: databaseIds[Math.floor(Math.random() * databaseIds.length)],
    }).createMany(10)
  }
}
