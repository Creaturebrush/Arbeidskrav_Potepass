// Anette Bratvold

export type Booking = {
  id: number;
  userId: number;
  userDogId: number[];
  petSitterId: number;
  fromDate: string;
  toDate: string;
  status: string;
  message: string;
  created: string;
  updated: string;
};

export type NewBooking = Omit<Booking, "id">;
