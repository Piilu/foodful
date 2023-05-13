import { type Instruction, type ingredients } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type FullRecipeData } from "~/constants/types";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export type RecipeReqCreateType = {
    name: string,
    description: string,
    userId?: string,
    totalTime: number | null,
    instructions: Instruction[],
    ingredients: ingredients[],
    recipeId?: number | null,
}

export type RecipeReqGetType = {
    id: number,
}

export type RecipeResCreateType = {
    success: boolean,
    error?: string,
    fullRecipeData: FullRecipeData | null,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResCreateType;
    const session = await getServerAuthSession({ req, res })
    const { name, description, userId, totalTime, ingredients, instructions, recipeId } = req.body as RecipeReqCreateType;
    const method = req.method;

    try
    {
        if (method === "GET")
        {
            const { id } = req.query as unknown as RecipeReqGetType
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const recipe = await prisma.recipe.findUnique({
                include: { ingredients: { orderBy: { priority: "asc" } }, instructions: { orderBy: { priority: "asc" } }, Favorites: true, user: true },
                where: {
                    id: parseInt(id),
                },
            })
            response.success = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response.fullRecipeData = recipe;
            res.status(200).json(response);
            return;
        }
        if (method === "POST" && session)
        {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const recipe = await prisma.recipe.create({
                include: {
                    ingredients: true,
                    instructions: true,
                    Favorites: true,
                    user: true,
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
            response.fullRecipeData = recipe;
            res.status(200).json(response);
            return;
        }
        if (method === "PUT" && session)
        {
            const startTime = performance.now();
            if (recipeId === null)
            {
                response.success = false;
                response.error = "Recipe Id is null";
                res.status(500).json(response);
                return;
            }

            const existingngRecipe = await prisma.recipe.findMany({ where: { id: recipeId }, select: { ingredients: true, instructions: true } })

            const delteInstructions = existingngRecipe[0]?.instructions.filter((instruction) => !instructions.some((ins) => ins.id === instruction.id))

            const deleteIngredients = existingngRecipe[0]?.ingredients.filter((ingredient) => !ingredients.some((ing) => ing.id === ingredient.id))

            console.log(instructions)
            const recipe = await prisma.recipe.update({
                include: {
                    ingredients: true,
                    instructions: true,
                    Favorites: true,
                    user: true,
                },
                where: {
                    id: recipeId,
                },
                data: {
                    name: name,
                    description: description,
                    totalTime: totalTime,
                    ingredients: {
                        upsert: ingredients.map((ingredient) => ({
                            where: ingredient.id !== undefined ? { id: ingredient?.id } : { id: -1 },
                            update: {
                                name: ingredient.name,
                                amount: ingredient.amount,
                                description: ingredient.description,
                                priority: ingredient.priority,
                            },
                            create: {
                                name: ingredient.name,
                                amount: ingredient.amount,
                                description: ingredient.description,
                                priority: ingredient.priority,
                            },
                        })),
                        deleteMany: deleteIngredients,
                    },
                    instructions: {
                        upsert: instructions.map((instruction) => ({
                            where: instruction.id !== undefined ? { id: instruction?.id } : { id: -1 },
                            update: {
                                step: instruction.step,
                                priority: instruction.priority,
                            },
                            create: {
                                step: instruction.step,
                                priority: instruction.priority,
                            },
                        })),
                        deleteMany: delteInstructions,
                    },
                },
            })


            response.success = true;
            const endTime = performance.now();
            const sortedInstructions = recipe.instructions.sort((a, b) => a.priority - b.priority)
            const sortedIngredients = recipe.ingredients.sort((a, b) => a.priority - b.priority)
            recipe.instructions = sortedInstructions;
            recipe.ingredients = sortedIngredients;
            response.fullRecipeData = recipe;
            console.log("Time: ", (endTime - startTime).toFixed(2) + "ms")
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