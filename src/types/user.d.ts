interface IUser {
  id: number
  firstName: string
  lastName: string
  email: string
  cpf?: string
  password?: string
  password_repeat?: string
}

export default IUser
