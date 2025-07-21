export interface IUser {
  _id: string;
  email: string;
  googleId: string;
  avatar: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}
