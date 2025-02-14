/**
 * Interface for the response message
 * @interface
 * @property {string} message - The message to display
 */
export interface MessageResponse {
  message: string
}

/**
 * Interface for the response message
 * @interface
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - The message to display
 */
export interface ResultMessageResponse {
  success: boolean
  message: string
}

/**
 * Interface for the bad request response
 * @interface
 * @property {string} code - The error code
 * @property {string} message - The error message
 */
export interface BadRequestResponse {
  code: string
  message: string
}

/**
 * Interface for the validation error
 * @interface
 * @property {string} message - The error message
 * @property {string} rule - The validation rule
 * @property {string} field - The field that failed validation
 */
export interface ValidationError {
  message: string
  rule: string
  field: string
}

/**
 * Interface for the validation error response
 * @interface
 * @property {ValidationError[]} errors - The list of validation errors
 * @property {string} errors[].message - The error message
 * @property {string} errors[].rule - The validation rule
 * @property {string} errors[].field - The field that failed validation
 */
export interface ValidationErrorResponse {
  errors: ValidationError
}
