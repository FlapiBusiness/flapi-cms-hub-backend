import { BaseEvent } from '@adonisjs/core/events'
import type User from '#models/user'
import type { ApplicationEventLogListenerPayload } from '#listeners/application_event_log_listener'
import { ApplicationEventLogActionType } from '#enums/application_event_log_action_type'

/**
 * Event to dispatch when a user sign up
 * @class SignUpEvent
 * @extends BaseEvent
 * @implements ApplicationEventLogListenerPayload
 */
export default class SignUpEvent extends BaseEvent implements ApplicationEventLogListenerPayload {
  public readonly action_type: ApplicationEventLogActionType = ApplicationEventLogActionType.SIGNUP
  public readonly message: string

  /**
   * Constructor to create a new SignUpEvent
   * @param {User} user - The user instance
   * @param {number} [project_id] - The project id
   * @description This event is used to create application event logs and send them to NATS when a user signs up
   */
  constructor(
    public readonly user: User,
    public readonly project_id?: number,
  ) {
    super()
    this.message = `${user.fullName} s'est inscrit avec l'email ${user.email}`
  }
}
