export interface TokenPayload {
  _id: string;
}

export interface InviteUser {
  password?: string;
  firstName: string;
  email: string;
  phoneNumber?: string;
  lastName?: string;
}
