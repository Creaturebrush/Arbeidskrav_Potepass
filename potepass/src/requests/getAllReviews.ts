import { type reviews } from "../types/reviews.type"

//const APIkey: string = "dreamTeam";

export async function getAllReviews(): Promise<reviews[]> {

    try {
    const response: Response = await fetch(`http://localhost:3000/api/reviews`);
       
    if (!response.ok){
        throw new Error(`kunne ikke laste opp${response.status}`);
    }

    const data: reviews[] = await response.json();
    return data;

    } catch (error) {
        throw error;
    }
}