import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "~/server/db";

export type ExampleReqType = {
    name: string,
}

export type ExampleResType = {
    success: boolean,
    error?: string,
}
export default function handler(req: NextApiRequest, res: NextApiResponse)
{
    const { name } = req.body as ExampleReqType;
    const response = {} as ExampleResType;

    try
    {
        response.success = true;
        res.status(200).json(response);
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