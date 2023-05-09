import { type NextApiRequest, type NextApiResponse } from "next/types";
import { prisma } from "~/server/db";
import { type Favorites, type Recipe, type User, type ingredients } from "@prisma/client";
import { type FullRecipeData } from "~/constants/types";
import { getServerAuthSession } from "~/server/auth";

export type RecipeReqListType = {
    userId?: string,
    page: number,
    take?: number,
    searchName?: string,
    favorite?: boolean,
    orderCreatedAt?: "asc" | "desc",
}

export type RecipeResListGetType = {
    success: boolean,
    recipe: (Recipe & {
        user: User;
        ingredients: ingredients[];
        Favorites: Favorites[];
    }) | null,
    recipes: FullRecipeData[],
    totalRecipes: number,
    error?: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as RecipeResListGetType;
    const session = await getServerAuthSession({ req, res })
    const { page, take, searchName, userId, favorite, orderCreatedAt } = req.body as RecipeReqListType;
    const method = req.method;

    try
    {
        if (method === "POST")
        {

            if (favorite)
            {
                const recipes = await prisma.favorites.findMany({
                    select: {
                        recipe: {
                            include: {
                                ingredients: true,
                                instructions: true,
                                Favorites: true,
                                user: true,
                            }
                        },
                    },
                    skip: page * take,
                    take: take,
                    orderBy: { recipe: { createdAt: orderCreatedAt } },
                    where: {
                        userId: userId,
                        recipe: {
                            name: { contains: searchName },
                        }
                    },

                });

                const totalRecipes = await prisma.favorites.count({
                    where: {
                        userId: userId,
                        recipe: {
                            name: { contains: searchName },
                        }
                    },
                });
                response.success = true;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                response.recipes = recipes.map((favorite) => favorite.recipe);
                response.totalRecipes = totalRecipes;
                res.status(200).json(response);
                return;
            }
            else
            {

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const recipes = await prisma.recipe.findMany({
                    skip: page * take,
                    take: take,
                    orderBy: { createdAt: orderCreatedAt },
                    where: {
                        name: { contains: searchName },
                        ...(userId != undefined ? { userId: userId } : {}),
                    },
                    include: {
                        ingredients: true,
                        instructions: true,
                        Favorites: true,
                        user: true,
                    }
                });

                const totalRecipes = await prisma.recipe.count({
                    where: {
                        name: {
                            contains: searchName,
                        },
                        ...(userId != undefined ? { userId: userId } : {}),
                    },
                });

                response.success = true;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                response.recipes = recipes;
                response.totalRecipes = totalRecipes;
                res.status(200).json(response);
                return;
            }
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