import { Button, Tooltip } from '@chakra-ui/react'
import { ActionIcon } from '@mantine/core';
import { IconLicense } from '@tabler/icons-react'
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react'
import { set } from 'zod';
import { EndPoint } from '~/constants/EndPoints';
import recipe from '~/pages/api/recipe';
import { MediaUpdateReq, MediaUpdateRes } from '~/pages/api/recipe/media';

type FavoriteButtonProps = {
    count: number;
    recipeId: number;
    isFavorite: boolean;
    isIcon?: boolean;
}
const FavoriteButton: FunctionComponent<FavoriteButtonProps> = (props) =>
{
    const { count, recipeId, isFavorite, isIcon } = props;
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
    if (isIcon)
    {
        return (
            <Tooltip openDelay={500} label={`Yum count ${mimicCount}`}>
                <ActionIcon color={mimicFavorite ? "orange" : "gray"} onClick={() => void addToFavorite()}>
                    <IconLicense />
                </ActionIcon>
            </Tooltip>
        )
    }
    else
    {

        return (
            <Button onClick={() => void addToFavorite()} w={"100%"} variant='ghost' colorScheme={mimicFavorite ? "orange" : "white"} size={"sm"} leftIcon={<IconLicense />}>Yum! {mimicCount}</Button>

        )
    }
}

export default FavoriteButton
