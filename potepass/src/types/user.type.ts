export type Dog = {
    id: number, 
    name: string, 
    breed: string, 
    age: number, 
    image: string,
    allergies: string[];
}

export type User = {
  id: number;
  userName: string;
  password: string;
  email: string;
  phone: number;
  location: string;
  description: string;
  image: string;
  dogs: Dog[];
};

export type NewUser = Omit <User, "id" | "password" | "email" | "description" | "dogs">;