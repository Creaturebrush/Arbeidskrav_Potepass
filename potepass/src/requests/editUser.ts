// FREDRIK

import type { User } from "../types/user.type";

const APIKey: string = "dreamTeam";

export async function editUser(userId: number, editedUser: Partial<User>) {
  try {
    const response: Response = await fetch(
      `http://localhost:3000/api/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(editedUser),
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
