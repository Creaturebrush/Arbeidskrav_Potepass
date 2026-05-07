// Anette Bratvold

import { type User } from "../types/user.type";

//const APIKey: string = "dreamTeam";

//READ
export async function getAllUsers(): Promise<User[]> {
  try {
    const response: Response = await fetch("http://localhost:3000/api/users");

    if (!response.ok) {
      throw new Error("Kunne ikke hente data" + response.status);
    }

    const data: User[] = await response.json();
    return data;
  } catch (error) {
    console.log("Oops, noe gikk galt" + error);
    throw error;
  }
}
