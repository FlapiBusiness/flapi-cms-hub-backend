import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import mjml from 'mjml'
import Mailjet from 'node-mailjet'
import logger from '@adonisjs/core/services/logger'
import type { Message } from '@adonisjs/mail'
import edge from 'edge.js'

/**
 * Service pour envoyer des emails.
 * @class MailService
 */
export default class MailService {
  /**
   * Envoie un email à un ou plusieurs destinataires.
   * @param {string[] | string} emailUsers - Les adresses email des destinataires.
   * @param {string} viewEmail - La vue à utiliser pour le rendu de l'email.
   * @param {string} emailSubject - L'objet de l'email.
   * @param {Record<string, any>} data - Les données à passer à la vue.
   * @returns {Promise<void>} - Une promesse vide.
   */
  public static async sendEmail(
    emailUsers: string[] | string,
    viewEmail: string,
    emailSubject: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const viewRender: string = await edge.render(`emails/${viewEmail}`, data)
      const htmlRender: string = mjml(viewRender).html

      // Use MailJet for environment development-remote, staging and production
      if (env.get('NODE_ENV') !== 'development' && env.get('NODE_ENV') !== 'test') {
        // @ts-ignore
        const mailjet: any = new Mailjet({
          apiKey: env.get('MAILJET_API_KEY'),
          apiSecret: env.get('MAILJET_API_SECRET_KEY'),
        })

        const toRecipients: { Email: string }[] = Array.isArray(emailUsers)
          ? emailUsers.map((email: string): { Email: string } => ({ Email: email }))
          : [{ Email: emailUsers }]

        mailjet.post('send', { version: 'v' + env.get('MAIJET_API_VERSION') }).request({
          Messages: [
            {
              From: {
                Email: env.get('MAIL_USERNAME'),
                Name: 'Flapi Support',
              },
              To: toRecipients,
              Subject: emailSubject,
              HTMLPart: htmlRender,
            },
          ],
        })
      }

      // use SMTP protocol to environment develop
      // Pushed to in-memory queue
      else {
        if (typeof emailUsers === 'string') {
          await mail.sendLater((message: Message): void => {
            message.to(env.get('MAIL_USERNAME')).from(emailUsers).subject(emailSubject).html(htmlRender)
          })
        } else if (Array.isArray(emailUsers)) {
          await Promise.all(
            emailUsers.map((emailUser: string): Promise<void> => {
              return mail.sendLater((message: Message): void => {
                message.to(env.get('MAIL_USERNAME')).from(emailUser).subject(emailSubject).html(htmlRender)
              })
            }),
          )
        }
      }
    } catch (error: any) {
      logger.error('Failed to send email : ', error)
      throw error
    }
  }
}
