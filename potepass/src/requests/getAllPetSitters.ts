import { type petSitters } from "../types/petSitters.type"

//const APIkey: string = "dreamTeam";

export async function getAllPetSitters(): Promise<petSitters[]> {

    try {
    const response: Response = await fetch(`http://localhost:3000/api/petSitters`);
       
    if (!response.ok){
        throw new Error(`kunne ikke laste opp${response.status}`);
    }

    const data: petSitters[] = await response.json();
    return data;

    } catch (error) {
        throw error;
    }
}