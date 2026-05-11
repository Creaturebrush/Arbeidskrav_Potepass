//Stine

import type  { petSitters } from "../types/PetSitters.type"
import type { User} from "../types/user.type"

const APIKey: string = "dreamTeam";

type CreatePetSitterForm = {
    pricePerDay: number,
    maxDogs: number,
    acceptsPuppies: boolean,
    acceptsLargeDogs: boolean,
    yearsOfExperience: number,
    experienceDescription: string,
};

export async function createPetSitter(user: User, form: CreatePetSitterForm) {
  try {

    const newPetSitter = {
    id: "",
    userId:user.id,
    userName: user.userName,
    location: user.location,

    pricePerDay: form.pricePerDay,
    rating: 0,
    reviewCount: 0,
    maxDogs: form.maxDogs,
    acceptsPuppies: form.acceptsPuppies,
    acceptsLargeDogs: form.acceptsLargeDogs,
    yearsOfExperience: form.yearsOfExperience,
    experienceDescription: form.experienceDescription,
    available: "",
    created: new Date().toISOString(),
    updated:new Date().toISOString()
  };

  const response: Response = await fetch(
    "http://localhost:3000/api/petSitters/", {
      method: "POST",
      headers:{
        "content-type": "application/json",
        Authorization: `Bearer ${APIKey}`
        },
        body: JSON.stringify(newPetSitter)
      }
    );


    if (!response.ok) {
      throw new Error(`En feil har oppstått — APIet returnerte feilkode ${response.status}`);
      }
      
    const data: petSitters = await response.json();

    return data;

    } catch (error) {
      throw error;
  }
 }