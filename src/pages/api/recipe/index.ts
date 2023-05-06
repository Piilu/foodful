import { Instruction, Recipe, ingredients } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { unknown } from "zod";
import { prisma } from "~/server/db";

export type RecipeReqCreateType = {
    name: string,
    description: string,
    userId?: string,
    totalTime: number | null,
    instructions: Instruction[],
    ingredients: ingredients[]
}

export type RecipeReqGetType = {
    id: number,
}

export type RecipeResCreateType = {
    success: boolean,
    recipe: Recipe & {
        ingredients: ingredients[];
    }
    error?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResCreateType;
    const session = await getSession({ req })
    const { name, description, userId, totalTime, ingredients, instructions } = req.body as RecipeReqCreateType;
    const method = req.method;

    try
    {
        if (method === "GET")
        {
            const { id } = req.query as unknown as RecipeReqGetType
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const recipe = await prisma.recipe.findUnique({
                include: { ingredients: true },
                where: {
                    id: parseInt(id),
                },
            })
            response.success = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response.recipe = recipe;
            res.status(200).json(response);
            return;
        }
        if (method === "POST" && session)
        {
            console.log("Data: ", ingredients)
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
                    },
                    instructions: {
                        createMany: {
                            data: instructions,
                        }
                    },
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