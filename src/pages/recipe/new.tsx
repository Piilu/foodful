import { Button, Box, Card, CardHeader, Heading, CardBody, Stack, FormControl, FormLabel, Input, Textarea, ButtonGroup, InputGroup, IconButton } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import React from 'react'
import CreateRecipe from '../../components/recipe/CreateRecipe';


export const newRecipe = () =>
{
    return (
        <CreateRecipe />
    )
}

export default newRecipe;