import { Recipe, Favorites, Instruction, ingredients, User } from "@prisma/client";

export enum Brands
{
    GOOGLE = "GOOGLE"
}

export type LinkType = {
    label: string,
    link: string,
    isProfile: boolean,
}

export type FullRecipeData = (Recipe & {
    ingredients: ingredients[];
    Favorites: Favorites[];
    instructions: Instruction[];
}) | null