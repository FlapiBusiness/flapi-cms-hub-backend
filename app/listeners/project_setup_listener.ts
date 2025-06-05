import NatsService from '#services/nats_service'
import type ProjectSetupEvent from '#events/project_setup_event'

/**
 * Listener to handle project setup updates
 * @class ProjectSetupListener
 */
export default class ProjectSetupListener {
  /**
   * Handle the event and send logs to NATS
   * @param {ProjectSetupEvent} event - The event payload
   * @returns {Promise<void>} - A promise that resolves when the log is sent
   */
  public async handle(event: ProjectSetupEvent): Promise<void> {
    await NatsService.publish(`project-setup-${event.projectSetup.project_id}`, event.projectSetup)
  }
}
