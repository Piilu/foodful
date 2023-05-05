import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "~/server/db";
import { Favorites, Recipe, User, ingredients } from "@prisma/client";
import { serialize } from "v8";

export type RecipeReqListType = {
    userId?: string,
    page: number,
    take?: number,
    searchName?: string,
}

export type RecipeResListGetType = {
    success: boolean,
    recipe: (Recipe & {
        user: User;
        ingredients: ingredients[];
        Favorites: Favorites[];
    }) | null,
    recipes: Recipe[],
    totalRecipes: number,
    error?: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResListGetType;
    const session = await getSession({ req })
    const { page, take } = req.body as RecipeReqListType;
    const method = req.method;

    try
    {
        if (method === "POST")
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const recipes = await prisma.recipe.findMany({
                skip: page * take,
                take: take,
                orderBy: { createdAt: "asc" },
                where: { name: { contains: searchName } },
            });
            
            const totalRecipes = await prisma.recipe.count({
                where: { name: { contains: searchName } },
            });

            response.success = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response.recipes = recipes;
            response.totalRecipes = totalRecipes;
            res.status(200).json(response);
            return;
        }
        response.success = false;
        response.error = "Not allowed";
        res.status(401).json(response);
        return;
    }
    catch (error: any)
    {
        response.success = false;
        response.error = error.message as string;
        res.status(500).json(response);
        return;
    }
}