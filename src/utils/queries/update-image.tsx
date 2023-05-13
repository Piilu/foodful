import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { ImageUpdateReq, ImageUpdateRes } from "~/pages/api/recipe/image";

export const updateRecipeImage = async (recipeId: number, imageUrl: string, imageName: string): Promise<boolean> =>
{

    const data: ImageUpdateReq = {
        recipeId: recipeId,
        imageUrl: imageUrl,
        imageName: imageName,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = (await axios.post(`${window.origin}${EndPoint.RECIPEIMAGE}`, data)).data as ImageUpdateRes;
    if (response.success)
    {
        return true;
    }
    return false;
}