import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  transporter = nodemailer.createTransport(
    this.configService.get('emailConfig'),
  );

  // Function to send an email
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      // const mailOptions = {
      //   from: this.configService.get('FROM_EMAIL'),
      //   to,
      //   subject,
      //   html: htmlContent,
      // };
      // Send the email
      // Dont have app password so console.logging it
      console.log(htmlContent, 'this is html content');
      // this.transporter.sendMail(mailOptions);
    } catch (error) {
      Logger.error(
        `Error in sending email where: params: ${JSON.stringify({ to, subject, htmlContent })}`,
      );
      throw error;
    }
  }
}
