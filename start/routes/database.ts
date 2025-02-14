import router from '@adonisjs/core/services/router'

const DatabaseController = () => import('#controllers/databases_controller')

/**
 * Route to create a new database
 */
router.post('/databases', [DatabaseController, 'create'])

/**
 * Route to get all databases
 */
router.get('/databases', [DatabaseController, 'getDatabases'])

/**
 * Route to get a database by ID
 */
router.get('/databases/:id', [DatabaseController, 'getDatabase'])

/**
 * Route to update a database
 */
router.put('/databases/:id', [DatabaseController, 'updateDatabase'])

/**
 * Route to delete a database
 */
router.delete('/databases/:id', [DatabaseController, 'deleteDatabase'])
