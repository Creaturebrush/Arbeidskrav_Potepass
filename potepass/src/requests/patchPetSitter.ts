//Stine
import { type PetSitters } from "../types/petSitters.type";

const APIKey: String = "dreamTeam";

export async function updatePetSitterProfile (
    id: Number,
    UpdatedPetSitter: Partial<PetSitters>): Promise<PetSitters> {
    
     try {
        const response: Response = await fetch(
          `http://localhost:3000/api/petSitters/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${APIKey}`,
            },
            body: JSON.stringify(UpdatedPetSitter),
          },
        );
    
        if (!response.ok) {
          throw new Error(
            `det har skjedd en feil ${response.status}`,
          );
        }
    
        const data: PetSitters = await response.json();
        return data;

      } catch (error) {
        console.error("kan ikke oppdatere:", error);
        throw error;
      }
    }
    