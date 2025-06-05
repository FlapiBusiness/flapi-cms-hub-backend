import { BaseEvent } from '@adonisjs/core/events'
import type User from '#models/user'
import type { ApplicationEventLogListenerPayload } from '#listeners/application_event_log_listener'
import { ApplicationEventLogActionType } from '#enums/application_event_log_action_type'

/**
 * Event to dispatch when a user sign out
 * @class SignOutEvent
 * @extends BaseEvent
 * @implements ApplicationEventLogListenerPayload
 */
export default class SignOutEvent extends BaseEvent implements ApplicationEventLogListenerPayload {
  public readonly action_type: ApplicationEventLogActionType = ApplicationEventLogActionType.SIGNOUT
  public readonly message: string

  /**
   * Constructor to create a new SignOutEvent
   * @param {User} user - The user instance
   * @param {number} [project_id] - The project id
   * @description This event is used to create application event logs and send them to NATS when a user signs out
   */
  constructor(
    public readonly user: User,
    public readonly project_id?: number,
  ) {
    super()
    console.log('SignOutEvent', user, project_id)
    this.message = `L'utilisateur ${user.fullName} avec l'email ${user.email} s'est déconnecté`
  }
}
