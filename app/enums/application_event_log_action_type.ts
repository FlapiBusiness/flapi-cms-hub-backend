/**
 * Enum for ApplicationEventLogActionType
 * @enum {string} application_event_log_action_type
 * @property {string} CREATE - For creating a new record.
 * @property {string} UPDATE - For updating an existing record.
 * @property {string} DELETE - For deleting an existing record.
 * @property {string} SIGNIN - For signing in.
 * @property {string} SIGNOUT - For signing out.
 * @property {string} SIGNUP - For signing up.
 * @property {string} INVITE - For inviting a user to application.
 */
export enum ApplicationEventLogActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SIGNIN = 'SIGNIN',
  SIGNOUT = 'SIGNOUT',
  SIGNUP = 'SIGNUP',
  INVITE = 'INVITE',
}
