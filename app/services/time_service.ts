import logger from '@adonisjs/core/services/logger'

/**
 * TimeService class provides utility methods for time-related operations.
 * @class
 */
export default class TimeService {
  /**
   * Sleep for a specified number of milliseconds.
   * * @param {number} ms - The number of milliseconds to sleep.
   * * @returns {Promise<void>} - A promise that resolves after the specified time.
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise((resolve: (value: void | PromiseLike<void>) => void): NodeJS.Timeout => setTimeout(resolve, ms))
  }

  /**
   * Retry a function multiple times with a delay between attempts.
   *
   * @template T
   * @param {() => Promise<T>} fn - The function to retry, which should return a Promise.
   * @param {number} [maxAttempts=3] - The maximum number of attempts to make.
   * @param {number} [delayMs=2000] - The delay in milliseconds between attempts.
   * @returns {Promise<T>} A promise that resolves with the result of the function if successful.
   * @throws {Error} Throws an error if all attempts fail.
   */
  public static async retry<T>(fn: () => Promise<T>, maxAttempts: number = 3, delayMs: number = 2000): Promise<T> {
    for (let attempt: number = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error: any) {
        if (attempt === maxAttempts) throw error
        logger.info(`Attempt ${attempt} failed, retrying after ${delayMs}ms...`)
        await this.sleep(delayMs)
      }
    }
    throw new Error('Max retry attempts reached')
  }
}
