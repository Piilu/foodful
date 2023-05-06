import { User } from "@prisma/client";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { UserResType } from "~/pages/api/user";

export const getUser = async (id: string): Promise<User | null> =>
{
    console.log("ID: ", id)
    const response = (await axios.get(`${window.origin}${EndPoint.USER}`, { params: { id: id } })).data as UserResType;
    return response.user;
}