//FREDRIK

import type { ProfileBooking, ProfileSitter } from "../types/p-bookingAndSitter.type";

export async function getAllProfileBookings(): Promise<ProfileBooking[]> {
  try {
    const response: Response = await fetch(
      "http://localhost:3000/api/bookings",
    );

    if (!response.ok) {
      throw new Error("Kunne ikke hente data" + response.status);
    }

    const data: ProfileBooking[] = await response.json();
    return data;
  } catch (error) {
    console.log("Oops, noe gikk galt" + error);
    throw error;
  }
}

export async function getAllProfileSitters(): Promise<ProfileSitter[]> {
  try {
    const response: Response = await fetch(
      "http://localhost:3000/api/petsitters",
    );

    if (!response.ok) {
      throw new Error("Kunne ikke hente data" + response.status);
    }

    const data: ProfileSitter[] = await response.json();
    return data;
  } catch (error) {
    console.log("Oops, noe gikk galt" + error);
    throw error;
  }
}