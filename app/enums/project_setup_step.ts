/**
 * Enum for project setup steps.
 * @enum {string} project_setup_step
 * @property {string} SETUP_STARTED - The setup process has started.
 * @property {string} VERIFY_SUBDOMAINS - Verifying subdomains.
 * @property {string} CREATE_SUBDOMAINS - Creating subdomains.
 * @property {string} CREATE_DATABASE - Creating a database.
 * @property {string} CREATE_REPOSITORIES - Creating repositories.
 * @property {string} DEPLOYMENT - Deployment in progress.
 * @property {string} SETUP_DONE - Setup is done.
 * @property {string} SETUP_FAILED - Setup has failed.
 */
export enum ProjectSetupStep {
  SETUP_STARTED = 'SETUP_STARTED',
  VERIFY_SUBDOMAINS = 'VERIFY_SUBDOMAINS',
  CREATE_SUBDOMAINS = 'CREATE_SUBDOMAINS',
  CREATE_DATABASE = 'CREATE_DATABASE',
  CREATE_REPOSITORIES = 'CREATE_REPOSITORIES',
  DEPLOYMENT = 'DEPLOYMENT',
  SETUP_DONE = 'SETUP_DONE',
  SETUP_FAILED = 'SETUP_FAILED',
}
