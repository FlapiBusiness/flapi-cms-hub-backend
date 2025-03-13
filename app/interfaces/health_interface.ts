/**
 * Debugging information for the running process
 */
export interface HealthCheckDebugInfo {
  /**
   * The process ID
   * @example 1234
   */
  pid: number

  /**
   * The parent process ID
   * @example 5678
   */
  ppid?: number

  /**
   * Number of seconds the process has been running
   * @example 3600
   */
  uptime: number

  /**
   * Node.js version
   * @example "16.15.1"
   */
  version: string

  /**
   * The platform on which the application is running
   * @example "linux"
   */
  platform: string
}

/**
 * Individual health check report
 */
export interface HealthCheckItem {
  /**
   * Whether the check is cached
   * @example true
   */
  isCached: boolean

  /**
   * The name of the check
   * @example "Database connection"
   */
  name: string

  /**
   * Status message of the check
   * @example "Connected successfully"
   */
  message: string

  /**
   * Status of the check
   * @example "ok"
   */
  status: string
}

/**
 * Health check report
 */
export interface HealthCheckReport {
  /**
   * Is the entire system healthy?
   * @example true
   */
  isHealthy: boolean

  /**
   * Overall system status
   * @example "ok"
   */
  status: string

  /**
   * Timestamp when the check was completed
   * @example "2024-02-12T12:34:56Z"
   */
  finishedAt: string

  /**
   * Debugging information
   */
  debugInfo: HealthCheckDebugInfo

  /**
   * List of health checks performed
   */
  checks: HealthCheckItem[]
}
