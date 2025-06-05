import type { CreateProjectSetupPayload } from '#interfaces/project_setup_interface'
import logger from '@adonisjs/core/services/logger'
import ProjectSetup from '#models/project_setup'
import ProjectService from '#services/project_service'

/**
 * Service to handle project operations
 * @class ProjectSetupService
 */
export default class ProjectSetupService {
  /**
   * Create a new project setup
   * @param {CreateProjectSetupPayload} payload - Data to create the project setup
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async createProjectSetup(payload: CreateProjectSetupPayload): Promise<ProjectSetup> {
    try {
      // Create the project setup
      const projectSetup: ProjectSetup = await ProjectSetup.create(payload)
      await ProjectService.updateProjectSetup(projectSetup)
      return projectSetup
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}
