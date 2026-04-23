import type { Dog, User } from "../types/user.type";

const APIKey: string = "dreamTeam";

export async function editDog(userId: number, dogId: number, editedDog: Partial<Dog>) {
  try {
    const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`);
    const user: User = await userResponse.json();

    const dogIndex = user.dogs.findIndex(d => d.id === dogId);

    if (dogIndex === -1) return;

    user.dogs[dogIndex] = {
        ...user.dogs[dogIndex],
        ...editedDog
    };
    
    
    const response: Response = await fetch(
      `http://localhost:3000/api/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(user)
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