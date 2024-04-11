import { add } from 'date-fns';
import { PostUserModel } from '../models/users/input/post.users.model';
import { UserService } from './user.service';
import { EmailConfirmationRepository } from '../repositories/email.confirmation.repository';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EmailConfirmDataDB } from '../models/common/email.confirmation/db/email.confirmation.db';

dotenv.config();

const mailerLogin = process.env.MAILER_LOGIN || 'str';
const mailerPassword = process.env.MAILER_PASSWORD || 'str';
export class EmailConfirmationService {
   static async createUserAndEmailData(
      userData: PostUserModel,
      confirmationCode: string
   ): Promise<boolean> {
      try {
         const user = await UserService.createUser(userData);
         if (!user) {
            console.log(
               'EmailConfirmationService.createUserAndEmailData, user error'
            );
            return false;
         }

         const emailData: EmailConfirmDataDB = {
            userID: user.id,
            confirmationCode: confirmationCode,
            expirationDate: add(new Date(), { days: 1 }),
            isConfirmed: false,
         };
         const email =
            await EmailConfirmationRepository.createEmailConfirmation(
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
      const transporter = nodemailer.createTransport({
         service: 'Mail.ru',
         auth: {
            user: mailerLogin,
            pass: mailerPassword,
         },
      });
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
}
