interface UserDoc {
  _id: string;
  anniversary?: Date;
  nickname: string | null;
  roles: string[];
  strikes: string[];
  timer?: string;
  username: string;
}
