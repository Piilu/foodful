import { Recipe as RecipePrisma } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { getPopularRecipes } from '~/utils/queries/get-popular-recipes';
import { Text } from '@mantine/core';
import Recipe from '../auth/Recipe';

const PopularRecipes = () =>
{
    const [recipes, setRecipes] = useState<RecipePrisma[]>([]);

    useEffect(() => { getRecipes() }, []);
    const getRecipes = async () =>
    {
        setRecipes(await getPopularRecipes());
    }
    return (
        <>
            {recipes?.length !== 0 ? recipes.map((recipe) => (
                <Recipe key={recipe.id} recipe={recipe} userId={recipe.userId} />
            )) : <Text variant='dimmed'>Can't find any recipes</Text>}
        </>
    )
}

export default PopularRecipes
