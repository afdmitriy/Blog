import { add } from 'date-fns';
import { EmailConfirmationRepository } from '../repositories/email.confirmation.repository';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EmailConfirmDataDB } from '../models/common/email.confirmation/db/email.confirmation.db';

dotenv.config();

const mailerLogin = process.env.MAILER_LOGIN || 'str';
const mailerPassword = process.env.MAILER_PASSWORD || 'str';

const transporter = nodemailer.createTransport({
   service: 'Mail.ru',
   auth: {
      user: mailerLogin,
      pass: mailerPassword,
   },
});
export class EmailConfirmationService {
   
   static async createConfirmationData(
      userId: string,
      confirmationCode: string
   ): Promise<boolean> {
      try {


         const emailData: EmailConfirmDataDB = {
            userID: userId,
            confirmationCode: confirmationCode,
            expirationDate: add(new Date(), { days: 1 }),
            isConfirmed: false,
         };
         const email =
            await EmailConfirmationRepository.createConfirmationCodeData(
               emailData
            );
         if (!email) {
            console.log(
               'EmailConfirmationService.createUserAndEmailData, email error'
            );
            return false;
         }
         console.log(
            'EmailConfirmationService.createUserAndEmailData return true'
         );
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async sendConfirmationMail(confirmationCode: string, email: string) {
      try {
         const info = await transporter.sendMail({
            from: `"Blog's server" <af.dmitr.test@mail.ru>`, // sender address
            to: `af.dmitr.test@mail.ru, ${email}`, // list of receivers
            subject: 'Email confirmation', // Subject line
            //text: 'Hello world?', // plain text body
            html: `<h1>Thank for your registration</h1>
                  <p>To finish registration please follow the link below:
                      <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                  </p>`,
         });
         console.log('Message sent: %s', info.messageId);
      } catch (error) {
         console.log(error);
      }
   }

   static async sendPasswordRecoveryMail(code: string, email: string) {
      try {
         const info = await transporter.sendMail({
            from: `"Blog's server" <af.dmitr.test@mail.ru>`, // sender address
            to: `af.dmitr.test@mail.ru, ${email}`, // list of receivers
            subject: 'Password recovery', // Subject line
            //text: 'Hello world?', // plain text body
            html: `<h1>Thank for your registration</h1>
                  <p>To finish password recovery please follow the link below:
                      <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                  </p>`,
         });
         console.log('Message sent: %s', info.messageId);
      } catch (error) {
         console.log(error);
      }
   }
}
