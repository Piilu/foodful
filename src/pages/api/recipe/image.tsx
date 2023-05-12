import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { RecipeResCreateType, RecipeReqCreateType } from ".";
import { date } from "zod";
import { prisma } from "~/server/db";

export type ImageUpdateReq = {
    recipeId: number;
    imageUrl: string;
    imageName: string;
}


export type ImageUpdateRes = {
    success: boolean;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as ImageUpdateRes;
    const session = await getServerAuthSession({ req, res })
    const { recipeId, imageName, imageUrl } = req.body as ImageUpdateReq;
    const method = req.method;

    try
    {
        if (method === "POST" && session)
        {

            const recipe = await prisma.recipe.update({
                where: {
                    id: recipeId,
                },
                data: {
                    imageUrl: imageUrl,
                    imageName: imageName,
                }
            })


        }

    }
    catch (error)
    {
        response.success = false;
        response.error = error.message;
        res.status(500).json(response);
        return;
    }
}