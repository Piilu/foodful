import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export type MediaUpdateReq = {
    recipeId: number;
}
export type MediaUpdateRes = {
    success: boolean;
    added: boolean;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const response = {} as MediaUpdateRes
    const { recipeId } = req.body as MediaUpdateReq;
    const session = await getServerAuthSession({ req, res });

    const method = req.method;
    try
    {

        if (method === "POST" && session?.user?.id)
        {
            if (!recipeId)
            {
                response.success = false;
                response.error = "Invalid recipe id";
                res.status(400).json(response);
                return;
            }

            const exists = await prisma.favorites.findFirst({
                where: {
                    userId: session.user.id,
                    recipeId: recipeId,
                }
            });

            if (exists !== null)
            {

                await prisma.favorites.delete({
                    where: {
                        id: exists.id,
                    }
                });
                response.added = false;
            }
            else
            {
                await prisma.favorites.create({
                    data: {
                        recipeId: recipeId,
                        userId: session.user.id,
                    }
                });
                response.added = true;
            }

            response.success = true;
            res.status(200).json(response);
            return;

        }
        response.success = false;
        response.error = "Not allowed";
        res.status(400).json(response);
        return;
    } catch (error: any)
    {
        response.success = false;
        response.error = error.message;
        res.status(500).json(response);
        return;
    }
}
