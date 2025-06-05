import { connect, StringCodec } from 'nats'
import type { NatsConnection, Codec } from 'nats'
import env from '#start/env'

/**
 * Service to handle NATS operations
 * @class NatsService
 */
export default class NatsService {
  private static connection: NatsConnection | null = null
  private static readonly sc: Codec<string> = StringCodec()

  /**
   * Get a connection to the NATS server
   * @returns {Promise<NatsConnection>} - The connection to the NATS server
   * @private
   */
  private static async getConnection(): Promise<NatsConnection> {
    if (!this.connection) {
      this.connection = await connect({ servers: env.get('NATS_SERVER') })
    }
    return this.connection
  }

  /**
   * Subscribe to a subject
   * @param {string} subject - The subject to subscribe to
   * @param payload - The payload to send to the subscriber
   * @returns {Promise<void>}
   */
  public static async publish<T>(subject: string, payload: T): Promise<void> {
    const conn: NatsConnection = await this.getConnection()
    conn.publish(subject, this.sc.encode(JSON.stringify(payload)))
  }

  /**
   * Close the connection to the NATS server
   * @returns {Promise<void>}
   */
  public static async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
    }
  }
}
