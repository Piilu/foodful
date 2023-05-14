import { Button } from '@chakra-ui/react'
import { IconLicense } from '@tabler/icons-react'
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react'
import { set } from 'zod';
import { EndPoint } from '~/constants/EndPoints';
import { MediaUpdateReq, MediaUpdateRes } from '~/pages/api/recipe/media';

type FavoriteButtonProps = {
    count: number;
    recipeId: number;
    isFavorite: boolean;
}
const FavoriteButton: FunctionComponent<FavoriteButtonProps> = (props) =>
{
    const { count, recipeId, isFavorite } = props;
    const [mimicCount, setMimicCount] = useState<number>(count);
    const [mimicFavorite, setMimicFavorite] = useState<boolean>(isFavorite);
    const router = useRouter();

    const addToFavorite = async () =>
    {
        const data: MediaUpdateReq = {
            recipeId: recipeId,
        }

        if (mimicFavorite)
        {
            setMimicCount(mimicCount - 1);
            setMimicFavorite(false);
        }
        else
        {
            setMimicCount(mimicCount + 1);
            setMimicFavorite(true);
        }
        await axios.post(`${window.origin}${EndPoint.MEDIA}`, data).then((res) =>
        {
            const newData = res.data as MediaUpdateRes;

            if (newData.success)
            {

                if (newData.added)
                {
                    setMimicCount(mimicCount + 1);
                    setMimicFavorite(true);
                }
                else
                {
                    setMimicCount(mimicCount - 1);
                    setMimicFavorite(false);
                }
            }
        }).catch((error) =>
        {

            setMimicCount(count);
            setMimicFavorite(isFavorite);
        })
    }
    return (
        <Button onClick={() => void addToFavorite()} w={"100%"} variant='ghost' colorScheme={mimicFavorite ? "orange" : "white"} size={"sm"} leftIcon={<IconLicense />}>Yum! {mimicCount}</Button>

    )
}

export default FavoriteButton
