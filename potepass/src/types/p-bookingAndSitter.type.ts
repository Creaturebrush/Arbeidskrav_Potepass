//FREDRIK

export type ProfileBooking = {
id: number,
userId: number,
userDogId: number,
petSitterId: number,
fromDate: string,
toDate: string,
status: string

}

export type ProfileSitter = {
    id: number,
    name: string,
    location: string,
    image: string
}