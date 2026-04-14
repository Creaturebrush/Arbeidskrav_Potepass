export type Dog = {
    id: number, 
    name: string, 
    breed: string, 
    age: number, 
    allergies: string[];
}

export type User = {
    id: number, 
    userName: string, 
    password: string, 
    email: string, 
    description: string,
    dogs: Dog[];
}

export type NewUser = Omit <User, "id" | "password" | "email" | "description" | "dogs">;