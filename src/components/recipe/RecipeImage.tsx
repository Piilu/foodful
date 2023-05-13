import React, { FunctionComponent, useEffect, useState } from 'react'
import { Image } from '@chakra-ui/react'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '~/server/firebase'
import { Loader } from '@mantine/core'

type RecipeImageProps = {
    imageName: string,
    recipeName: string,
    isListItem?: boolean,
}
const RecipeImage: FunctionComponent<RecipeImageProps> = (props) =>
{
    const { imageName, isListItem, recipeName } = props;
    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>
    {
        if (!imageName) return;
        const imageRef = ref(storage, `${imageName}`);
        getDownloadURL(imageRef).then((url) =>
        {
            setImage(url);
            setLoading(false);
        }).catch((error) =>
        {
            setLoading(false);
        })

    }, [imageName])

    if (loading && imageName != "")
    {
        return <Loader color='green' />
    }
    if (isListItem)
    {
        return (
            <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                src={image}
                alt={recipeName}
            />
        )
    }
    else
    {

        return (
            <Image
                objectFit='cover'
                src={image}
                alt={recipeName}
            />
        )
    }
}

export default RecipeImage
