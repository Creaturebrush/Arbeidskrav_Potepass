import type { Dog, User } from "../types/user.type";

const APIKey: string = "dreamTeam";

export async function addDog(userId: number, newDog: Partial<Dog>) {
  try {
    const userResponse = await fetch(
      `http://localhost:3000/api/users/${userId}`,
    );
    const user: User = await userResponse.json();

    const addedDog = {
      id: Date.now(),
      name: newDog.name || "",
      breed: newDog.breed || "",
      age: newDog.age || 0,
      image: "",
      allergies: newDog.allergies || [],
    };

    user.dogs.push(addedDog);

    const response: Response = await fetch(
      `http://localhost:3000/api/users/${userId}`,
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
      const data: User = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
}
