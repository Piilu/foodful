import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { type FullRecipeData } from "~/constants/types";
import { type PopularResType } from "~/pages/recipe/recipe/popular";

export const getPopularRecipes = async (id: string): Promise<FullRecipeData[] | null> =>
{
    const response = (await axios.get(`${window.origin}${EndPoint.POPULARRECIPE}`)).data as PopularResType;
    return response.recipes as FullRecipeData[];
}