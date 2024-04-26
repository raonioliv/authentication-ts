import { EmailParams, MailerSend, /*Recipient*/ Sender } from "mailersend"
import IUser from "../types/user"
import { OS } from "../utils/system"
import mailServiceTemplates from "../schemas/mailServiceTemplates"
import crypt from "../utils/crypt"

function sendEmail(emailParams: EmailParams) {
  const sender = new Sender(OS.ENV.EMAIL.SERVICE_DOMAIN, "Champs")
  const mailerSend = new MailerSend({
    apiKey: OS.ENV.EMAIL.API_KEY
  })
  emailParams.setFrom(sender)
  mailerSend.email.send(emailParams)
}
function sendAccountRecoveryEmail(user: IUser) {
  const recoveryJWT = crypt.encodeJWT({ email: user.email }, "30m")
  const templateId = getTemplateId("accountRecovery")
  const emailParams = new EmailParams()
    .setSubject("Champs - Redefinir senha.")
    .setTo([{ email: user.email, name: user.firstName }])
    .setPersonalization([
      {
        email: user.email,
        data: {
          name: user.firstName,
          actionURL: OS.ENV.API.BASE_URL + `/resetPassword?token=${recoveryJWT}`
        }
      }
    ])
    .setTemplateId(templateId)

  sendEmail(emailParams)
}
function sendAccountCreatedEmail(user: IUser) {
  const confirmationJWT = crypt.encodeJWT({ email: user.email }, "30m")
  const templateId = getTemplateId("accountCreated")
  const emailParams = new EmailParams()
    .setSubject("Champs - Conta criada.")
    .setTo([{ email: user.email, name: user.firstName }])
    .setPersonalization([
      {
        email: user.email,
        data: {
          name: user.firstName,
          actionURL:
            OS.ENV.API.BASE_URL + `/confirmAccount?token=${confirmationJWT}`
        }
      }
    ])
    .setTemplateId(templateId)

  sendEmail(emailParams)
}

function getTemplateId(name: keyof typeof mailServiceTemplates) {
  return mailServiceTemplates[name]
}

export default {
  sendAccountCreatedEmail,
  sendAccountRecoveryEmail
}
