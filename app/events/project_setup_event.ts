import { BaseEvent } from '@adonisjs/core/events'
import type ProjectSetup from '#models/project_setup'

/**
 * Event to dispatch when a project setup is updated
 */
export default class ProjectSetupEvent extends BaseEvent {
  /**
   * Constructor
   * @param {ProjectSetup} projectSetup - The project setup instance
   */
  constructor(public readonly projectSetup: ProjectSetup) {
    super()
  }
}
