import { Recipe, User } from "@prisma/client";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { PopularResType } from "~/pages/api/recipe/popular";
import { UserResType } from "~/pages/api/user";

export const getPopularRecipes = async (id: string): Promise<Recipe[] | null> =>
{
    const response = (await axios.get(`${window.origin}${EndPoint.POPULARRECIPE}`)).data as PopularResType;
    return response.recipes as Recipe[];
}