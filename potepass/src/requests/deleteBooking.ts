// Anette Bratvold

export async function deleteBooking(bookingId: Number): Promise<void> {
  try {
    const response: Response = await fetch(
      `http://localhost:3000/api/bookings/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application.json",
          Authorization: "Bearer dreamTeam",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status}`);
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}
