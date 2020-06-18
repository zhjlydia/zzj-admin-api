export interface UserRO {
  id: number;
  username: string;
  email: string;
  image?: string;
}

export interface UserWhthToken {
  user: UserRO;
  token: string;
}
