// Anette Bratvold

import type { Booking, NewBooking } from "../types/booking.type";

export async function patchBooking(
  id: number,
  updatedBooking: Partial<NewBooking>,
): Promise<Booking> {
  try {
    const response: Response = await fetch(
      `http://localhost:3000/api/bookings/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dreamTeam",
        },
        body: JSON.stringify(updatedBooking),
      },
    );

    if (!response.ok) {
      throw new Error(
        `En feil har oppstått APIet returnerte feilkode ${response.status}`,
      );
    }

    const data: Booking = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
