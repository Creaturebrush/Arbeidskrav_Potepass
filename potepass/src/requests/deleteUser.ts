// FREDRIK

const APIKey: string = "dreamTeam";

export async function deleteUser(userId: number) {
  try {
    const response: Response = await fetch(
      `http://localhost:3000/api/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`En feil har oppstått. Feilkode: ${response.status}`);
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}
