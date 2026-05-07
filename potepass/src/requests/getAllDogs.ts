//FREDRIK

import { type Dog } from "../types/dog.type";

export async function getAllDogs(): Promise<Dog[]> {
  try {
    const response: Response = await fetch("http://localhost:3000/api/dogs");

    if (!response.ok) {
      throw new Error("Kunne ikke hente data" + response.status);
    }

    const data: Dog[] = await response.json();
    return data;
  } catch (error) {
    console.log("Oops, noe gikk galt" + error);
    throw error;
  }
}