import React, { useEffect, useState } from 'react'
import { getPopularRecipes } from '~/utils/queries/get-popular-recipes';
import { Loader, Text } from '@mantine/core';
import Recipe from '../recipe/Recipe';
import { type FullRecipeData } from '~/constants/types';
import { useRouter } from 'next/router';

const PopularRecipes = () =>
{
    const [recipes, setRecipes] = useState<FullRecipeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => { void getRecipes(); setLoading(false) }, [router]);
    const getRecipes = async () =>
    {
        setRecipes(await getPopularRecipes());
    }
    return (
        <>
            {loading ? <Loader mb={10} size={50} variant="dots" color='green' /> : null}
            {recipes?.length !== 0 ? recipes.map((recipe) => (
                <Recipe key={recipe?.id} recipe={recipe} userId={recipe?.userId as string} />
            )) : <Text variant='dimmed'>Can't find any recipes</Text>}
        </>
    )
}

export default PopularRecipes
