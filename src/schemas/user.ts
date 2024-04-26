import Joi from "joi"

export const registrationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .pattern(/^[a-zA-Z\s',.-]+$/)
    .min(3)
    .max(30)
    .messages({
      "string.pattern.base": "Nome inválido",
      "string.empty": "Nome obrigatório"
    }),

  lastName: Joi.string()
    .pattern(/^[a-zA-Z\s',.-]+$/)
    .required()
    .messages({
      "string.pattern.base": "Sobrenome inválido",
      "string.empty": "Sobremome obrigatório"
    }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email inválido",
    "string.empty": "Email obrigatório"
  }),

  password: Joi.string().required().min(8),

  password_repeat: Joi.any()
    .required()
    .valid(Joi.ref("password"))
    .messages({ "any.only": "As senhas não coincidem" })
})
export const loginSchema = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required()
})

export const accountRecovery = Joi.object({
  email: Joi.string().required()
})
