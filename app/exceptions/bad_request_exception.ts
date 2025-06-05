import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Exception lancée lorsqu'une requête est incorrecte.
 * @class BadRequestException
 */
export default class BadRequestException extends Exception {
  public static status: number = 400
  public static code: string = 'E_BAD_REQUEST'

  protected messages?: string[]

  /**
   * Crée une instance de l'exception.
   * @constructor
   * @param {Object} params - Les paramètres de l'exception.
   * @param {string} [params.message] - Le message d'erreur unique (optionnel, par défaut 'Bad Request').
   * @param {string[]} [params.messages] - Un tableau de messages d'erreur (optionnel).
   */
  constructor(params?: { message?: string; messages?: string[] }) {
    super(params?.message || 'Bad Request')
    this.messages = params?.messages
  }

  /**
   * Gère l'exception en renvoyant une réponse JSON.
   * @param {BadRequestException} error - L'erreur a géré.
   * @param {HttpContext} ctx - Le contexte HTTP.
   */
  public handle(error: this, ctx: HttpContext): void {
    const responsePayload: { code: string; message?: string; messages?: string[] } = {
      code: error.code || BadRequestException.code,
    }
    if (error.messages && error.messages.length > 0) {
      responsePayload.messages = error.messages
    } else {
      responsePayload.message = error.message
    }

    ctx.response.status(error.status).send(responsePayload)
  }
}
