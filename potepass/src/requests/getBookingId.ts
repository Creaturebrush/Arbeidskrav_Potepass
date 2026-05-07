import type { Booking } from "../types/booking.type";

export async function getBookingId(id: number): Promise<Booking> {
  const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
    headers: {
      Authorization: "Bearer dreamTeam",
    },
  });

  if (!response.ok) {
    throw new Error(`Could not get booking with id ${id}`);
  }

  return await response.json();
}
