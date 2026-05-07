//FREDRIK

import type { Dog } from "../types/dog.type";

const APIKey: string = "dreamTeam";

export async function editDog(dogId: number, editedDog: Partial<Dog>) {
  try {
    const response: Response = await fetch(
      `http://localhost:3000/api/dogs/${dogId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(editedDog),
      },
    );

    if (!response.ok) {
      throw new Error(`En feil har oppstått. Feilkode: ${response.status}`);
    } else {
      const data: Dog = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
}