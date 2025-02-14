import axios from 'axios'

/**
 * Service to send SMS
 * Utilise Textbee doc : https://github.com/vernu/textbee?tab=readme-ov-file
 */
export default class SmsService {
  public static async sendSms(number: string, message: string): Promise<void> {
    const API_KEY: string = '1289f982-f87b-4592-87e0-b1397aa6cf51'
    const DEVICE_ID: string = '67a6323dca64e1256aaeaf66'

    await axios.post(
      `https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`,
      {
        recipients: ['+33671833458'],
        message: message,
      },
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    )
  }
}
