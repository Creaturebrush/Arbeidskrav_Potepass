//Stine
import { type PetSitters } from "../types/petSitters.type"

//const APIkey: string = "dreamTeam";

export async function getAllPetSitters(): Promise<PetSitters[]> {

    try {
    const response: Response = await fetch(`http://localhost:3000/api/petSitters`);
       
    if (!response.ok){
        throw new Error(`kunne ikke laste opp${response.status}`);
    }

    const data: PetSitters[] = await response.json();
    return data;

    } catch (error) {
        throw error;
    }
}