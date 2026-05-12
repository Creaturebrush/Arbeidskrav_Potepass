//Stine husk å fjerne "accepts" hvis de andre ikke er enige
export type PetSitters = {
    
    id: number,
    name: string,
    location: string,
    pricePerDay: number,
    rating: number,
    reviewCount: number,
    maxDogs: number,
    acceptsPuppies: boolean,
    acceptsAdultDogs: boolean;
    acceptsSeniorDogs: boolean;
    acceptsSmallDogs: boolean;
    acceptsMediumDogs: boolean;
    acceptsLargeDogs: boolean,
    yearsOfExperience: number,
    experienceDescription: string,
    available: boolean,
    created: string,
    updated: string

};