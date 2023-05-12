import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "~/server/firebase";

export const getImage = async (imageName: string): string =>
{
    const imageRef = ref(storage, imageName);
    await getDownloadURL(imageRef).then((url) =>
    {
        console.log(url)
        console.log("url", url)
        return url;
    }).catch((err) =>
    {
        return "";
    })
}