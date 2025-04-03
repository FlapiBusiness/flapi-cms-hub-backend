import router from '@adonisjs/core/services/router'

const ApplicationEventLogController = () => import('#controllers/application_event_log_controller')

/**
 * Route pour la création d'un événement d'application
 */
router.post('/application-event-log', [ApplicationEventLogController, 'createApplicationEventLog'])

/**
 * Route pour la récupération de tous les événements d'application
 */
router.get('/application-event-logs', [ApplicationEventLogController, 'getAllApplicationEventLogs'])

/**
 * Route pour la récupération des événements d'application par ID utilisateur
 */
router.get('/application-event-logs/user/:user_id', [ApplicationEventLogController, 'getApplicationEventLogsByUserId'])

/**
 * Route pour la récupération des événements d'application par ID projet
 */
router.get('/application-event-logs/project/:project_id', [
  ApplicationEventLogController,
  'getApplicationEventLogsByProjectId',
])
