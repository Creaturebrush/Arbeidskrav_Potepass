// FREDRIK

import type { User } from "../types/user.type";

const APIKey: string = "dreamTeam";

export async function createUser(createdUser: Partial<User>) {
  try {
    const newUser = {
      id: "",
      userName: createdUser.userName,
      location: createdUser.location,
      password: createdUser.password,
      email: createdUser.email,
      phone: createdUser.phone,
      image: createdUser.image || "/images/useravatar.png",
      description: createdUser.description,
    };

    const response: Response = await fetch(
      `http://localhost:3000/api/users/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
        body: JSON.stringify(newUser),
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