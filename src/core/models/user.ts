export interface UserVo {
  email: string;
  password: string;
}
export class UserDto {
  id: number;
  username: string;
  email: string;
  image?: string;
}

export interface UserWhthToken {
  user: UserDto;
  token: string;
}
