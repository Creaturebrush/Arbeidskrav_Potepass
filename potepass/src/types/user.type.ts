export type User = {
  id: number;
  userName: string;
  password: string;
  email: string;
  phone: number;
  location: string;
  description: string;
  image: string;
};

export type NewUser = Omit<
  User,
  "id" | "password" | "email" | "description" | "dogs"
>;
