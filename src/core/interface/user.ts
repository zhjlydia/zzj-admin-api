export interface User {
  id: number;
  username: string;
  email: string;
  image?: string;
}

export interface UserWhthToken {
  user: User;
  token: string;
}
