// Anette Bratvold
import type { Booking, NewBooking } from "../types/booking.type";

const apiKey: string = "dreamTeam";

export async function postBooking(newBooking: NewBooking): Promise<Booking> {
  try {
    const response: Response = await fetch(
      "http://localhost:3000/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(newBooking),
      },
    );

    if (!response.ok) {
      throw new Error(
        `En feil har oppstått — APIet returnerte feilkode ${response.status}`,
      );
    }

    const data: Booking = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
