// FREDRIK

import type { Dog } from "../types/dog.type";

const APIKey: string = "dreamTeam";

export async function addDog(newDog: Partial<Dog>) {
  try {
    const addedDog = {
      id: "",
      petOwnerId: newDog.petOwnerId,
      name: newDog.name || "",
      breed: newDog.breed || "",
      age: newDog.age || 0,
      image: newDog.image || "",
      allergies: newDog.allergies || [],
    };

    const response: Response = await fetch(
      `http://localhost:3000/api/dogs/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(addedDog),
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
