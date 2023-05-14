import { MenuItem, useToast } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react'
import { EndPoint } from '~/constants/EndPoints';

type DeleteButtonProps = {
    recipeId: number;
}
const DeleteButton: FunctionComponent<DeleteButtonProps> = (props) =>
{
    const { recipeId } = props;
    const toast = useToast();
    const router = useRouter();
    const delteRecipe = async () =>
    {
        await axios.delete(`${window.origin}${EndPoint.RECIPE}`, { params: { recipeId: recipeId } }).then((res) =>
        {
            console.log(res);
            const newData = res.data as { success: boolean, error?: string };
            if (newData.success)
            {
                toast({
                    title: "Success",
                    description: "Recipe deleted",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                void router.replace(router.asPath, undefined, { scroll: false });
            }
            else
            {
                throw new Error(newData.error);
            }
        }).catch((error: AxiosError) =>
        {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
    }
    return (
        <MenuItem color={"red"} onClick={() => void delteRecipe()}>Delete</MenuItem>
    )
}

export default DeleteButton
