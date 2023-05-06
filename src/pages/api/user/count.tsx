import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "~/server/db";

export type UserCountReqType = {
    userId: string;
}

export type UserCountResType = {
    success: boolean;
    favorites?: number;
    recipes?: number;
    error?: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const { userId } = req.body as UserCountReqType;
    const response = {} as UserCountResType;
    const method = req.method;
    try
    {
        if (method === "POST")
        {
            const favorites = await prisma.favorites.count({
                where: { userId: userId }
            })

            const recipes = await prisma.recipe.count({
                where: { userId: userId }
            })

            response.success = true;
            response.favorites = favorites;
            response.recipes = recipes;
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