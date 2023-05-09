import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export type UserReqType = {
    name: string,
    website?: string,
    image?: string,
    bio?: string,
}
export type UserGetType = {
    id: string,
}
export type UserResType = {
    success: boolean,
    user: User | null,
    error?: string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
    const { name, website, image, bio } = req.body as UserReqType;
    const session = await getServerAuthSession({ req, res })
    const response = {} as UserResType;
    const method = req.method;
    try
    {
        if (method === "GET")
        {
            const { id } = req.query as unknown as UserGetType;
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                }
            })
            response.success = true;
            response.user = user;
            res.status(200).json(response);
            return;
        }
        if (method === "PUT" && session)
        {
            if (name === null || name === "")
            {
                response.success = false;
                response.error = "Name cannot be empty";
                res.status(401).json(response);
                return;
            }
            const user = await prisma.user.update({
                where: {
                    id: session?.user?.id,
                },
                data: {
                    name: name,
                    website: website,
                    image: image,
                    bio: bio,
                },
            });
            response.success = true;
            response.user = user;
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        response.error = error.message;
        res.status(500).json(response)
        return;
    }
}