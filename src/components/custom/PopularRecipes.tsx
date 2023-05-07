import { Recipe as RecipePrisma } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { getPopularRecipes } from '~/utils/queries/get-popular-recipes';
import { Loader, Text } from '@mantine/core';
import Recipe from '../auth/Recipe';

const PopularRecipes = () =>
{
    const [recipes, setRecipes] = useState<RecipePrisma[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => { getRecipes(); setLoading(false) }, []);
    const getRecipes = async () =>
    {
        setRecipes(await getPopularRecipes());
    }
    return (
        <>
            {loading ? <Loader mb={10} size={50} variant="dots" color='green' mx={"auto"} /> : null}
            {recipes?.length !== 0 ? recipes.map((recipe) => (
                <Recipe key={recipe.id} recipe={recipe} userId={recipe.userId} />
            )) : <Text variant='dimmed'>Can't find any recipes</Text>}
        </>
    )
}

export default PopularRecipes
