interface User {
  _id?: string;
  banned?: boolean;
  nickname?: string | null;
  roles?: string[];
  strikes?: string[];
  timer?: string;
  username?: string;
}
