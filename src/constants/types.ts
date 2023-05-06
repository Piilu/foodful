import { Recipe, Favorites, Instruction, ingredients } from "@prisma/client";

export enum Brands
{
    GOOGLE = "GOOGLE"
}

export type LinkType = {
    label: string,
    link: string,
    isProfile: boolean,
}

export type FullRecipeData = {
    recipe: (Recipe & {
        Favorites: Favorites[];
        instructions: Instruction[];
        ingredients: ingredients[];
    }) | null
}