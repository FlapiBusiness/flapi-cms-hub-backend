import type { ProjectPayload } from '#validators/project_validator'
import Project from '#models/project'
import logger from '@adonisjs/core/services/logger'

/**
 * Service to handle project operations
 * @class ProjectService
 */
export default class ProjectService {
  /**
   * @param {ProjectPayload} payload - Data to create the project
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async createProject(payload: ProjectPayload): Promise<void> {
    try {
      // Create the project
      await Project.create({
        applicationName: payload.application_name,
        userId: payload.user_id,
        domainName: payload.domain_name,
        fileId: payload.file_id,
        databaseId: payload.database_id,
      })
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}
