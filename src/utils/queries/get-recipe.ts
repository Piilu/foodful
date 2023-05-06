import { User } from "@prisma/client";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { FullRecipeData } from "~/constants/types";
import { RecipeResCreateType } from "~/pages/api/recipe";
import { UserResType } from "~/pages/api/user";

export const getRecipe = async (id: number): Promise<FullRecipeData | null> =>
{
    const response = (await axios.get(`${window.origin}${EndPoint.RECIPE}`, { params: { id: id } })).data as RecipeResCreateType;
    return response.FullRecipeData;
}