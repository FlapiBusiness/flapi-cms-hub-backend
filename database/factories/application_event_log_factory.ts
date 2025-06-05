import factory from '@adonisjs/lucid/factories'
import { ApplicationEventLogActionType } from '#enums/application_event_log_action_type'
import ApplicationEventLog from '#models/application_event_log'

export const ApplicationEventLogFactory = factory
  .define(ApplicationEventLog, async ({ faker }) => {
    return {
      action_type: faker.helpers.arrayElement(Object.values(ApplicationEventLogActionType)),
      message: faker.lorem.sentence(),
    }
  })
  .build()
