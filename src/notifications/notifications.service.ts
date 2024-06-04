import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private client: Twilio.Twilio;

  constructor() {
    this.client = new Twilio.Twilio(
      `${process.env.TWILIO_ACCOUNT_SID}`,
      `${process.env.TWILIO_AUTH_TOKEN}`,
    );
  }

  async sendWhatsApp(to: string, body: string) {
    try {
      const result = await this.client.messages.create({
        body,
        from: `whatsapp:+${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+55${to}`,
      });

      return result.errorCode;
    } catch (error) {
      console.log(error);
    }
  }
}
