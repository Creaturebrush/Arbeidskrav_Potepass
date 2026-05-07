// Anette Bratvold

import { type Petsitter } from "../types/petsitter.type";

export async function getAllPetsitters(): Promise<Petsitter[]> {
  try {
    const response: Response = await fetch("http://localhost:3000/api/petsitters");

    if (!response.ok) {
      throw new Error("Kunne ikke hente data" + response.status);
    }

    const data: Petsitter[] = await response.json();
    return data;
  } catch (error) {
    console.log("Oops, noe gikk galt" + error);
    throw error;
  }
}