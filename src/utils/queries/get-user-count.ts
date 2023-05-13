import { User } from "@prisma/client";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { UserResType } from "~/pages/api/user";
import { UserCountResType } from "~/pages/api/user/count";

export const getUserCount = async (id: string): Promise<UserCountResType | null> =>
{
    let data = { userId: id };
    const response = (await axios.post(`${window.origin}${EndPoint.USERCOUNT}`, data)).data as UserCountResType;
    return response;
}