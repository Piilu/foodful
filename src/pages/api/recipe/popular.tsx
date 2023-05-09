import { type NextApiRequest, type NextApiResponse } from "next/types";
import { type FullRecipeData } from "~/constants/types";
import { prisma } from "~/server/db";

export type PopularResType = {
    success: boolean;
    recipes?: FullRecipeData[];
    error?: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{

    const method = req.method;
    const response = {} as PopularResType;

    if (method === "GET")
    {
        const recipes = await prisma.recipe.findMany({
            take: 3,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                ingredients: true,
                instructions: true,
                user: true,
                Favorites: true,
            }
        });
        response.success = true;
        response.recipes = recipes;
        res.status(200).json(response);
        return;
    }

    response.success = false;
    response.error = "Not allowed";
    res.status(401).json(response);
    return;
}