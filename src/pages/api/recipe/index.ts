import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { RecipeReqCreateType } from "./create";
import { prisma } from "~/server/db";
import { Favorites, Recipe, User, ingredients } from "@prisma/client";

export type RecipeReqGetType = {
    id?: number,
    userId?: string,
    findMany?: boolean,
}

export type RecipeResGetType = {
    success: boolean,
    recipe: (Recipe & {
        user: User;
        ingredients: ingredients[];
        Favorites: Favorites[];
    }) | null,
    recipes: Recipe[],

    error?: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResGetType;
    const session = await getSession({ req })
    const { id, userId, findMany } = req.query as unknown as RecipeReqGetType;
    const method = req.method;

    try
    {
        if (method === "GET")
        {
            if (findMany == "false")
            {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const recipe = await prisma?.recipe.findFirst({
                    include: {
                        ingredients: true,
                        user: true,
                        Favorites: true,
                    },
                    where: {
                        id: parseInt(id),
                    },
                });
            }

            if (findMany == "true")
            {
                const recipes = await prisma?.recipe.findMany({
                    where: {
                        userId: userId,
                    },
                });

                response.success = true;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                response.recipes = recipes;
                res.status(200).json(response);
                return;
            }
            response.success = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response.recipe = recipe;
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