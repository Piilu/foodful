import { Recipe, ingredients } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";

export type RecipeReqCreateType = {
    name: string,
    description: string,
    userId: string,
    totalTime?: number,
    ingredients: ingredients[]
}

export type RecipeResCreateType = {
    success: boolean,
    recipe: Recipe & {
        ingredients: ingredients[];
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResCreateType;
    const session = await getSession({ req })
    const { name, description, userId, totalTime, ingredients } = req.body as RecipeReqCreateType;
    const method = req.method;

    try
    {
        if (method === "POST" && session)
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const recipe = await prisma.recipe.create({
                include: {
                    ingredients: true,
                },
                data: {
                    userId: session?.user.id,
                    name: name,
                    description: description,
                    totalTime: totalTime,
                    ingredients: {
                        createMany: {
                            data: ingredients,
                        }
                    }
                },
            })


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
        response.error = error.message;
        res.status(500).json(response);
        return;
    }
}