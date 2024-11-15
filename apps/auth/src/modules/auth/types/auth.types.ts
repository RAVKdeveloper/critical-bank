export interface AuthIdentifierObj {
  email?: string
  phoneNumber?: string
  tgId?: number
}

export interface RegistrationCreatedData extends AuthIdentifierObj {
  passwordHash: string
  userLastName?: string
  userName: string
  userSurname: string
}
