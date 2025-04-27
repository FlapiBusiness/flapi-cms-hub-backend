/**
 * Enum for project setup status.
 * @enum {string} project_setup_status
 * @property {string} PENDING - The setup process is pending.
 * @property {string} IN_PROGRESS - The setup process is in progress.
 * @property {string} COMPLETED - The setup process is completed.
 * @property {string} FAILED - The setup process has failed.
 */
export enum ProjectSetupStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
