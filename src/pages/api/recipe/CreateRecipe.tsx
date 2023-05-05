import { Heading, Stack, FormControl, FormLabel, Box, Input, Textarea, InputGroup, IconButton, Button } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { ActionIcon } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react'
import React from 'react'

const CreateRecipe = () =>
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            Ingredients: [
                { name: 'Muna', amount: '1', description: "lahe" },
                { name: 'Muna', amount: '1', description: "lahe" },
            ],
        },

        validate: {
            name: (value) => (value.length > 3 && value.length <= 150 ? null : "Name has to be between 3 and 150 characters"),
        },
    });
    const handleRecipeCreate = () =>
    {
        console.log(form.values);
    }

    const ingredients = form.values.Ingredients.map((item, index) => (
        // eslint-disable-next-line react/jsx-key
        <InputGroup key={index} gap={5}>
            {/* <p>Lisa asju</p> */}
            <Input {...form.getInputProps(`Ingredients.${index}.name`)} w={400} placeholder='Eggs, Bacon, Sauce' />
            <Input {...form.getInputProps(`Ingredients.${index}.amount`)} w={200} placeholder='2g' />
            <Input {...form.getInputProps(`Ingredients.${index}.description`)} w={200} placeholder='Small detail' />
            <IconButton aria-label='Open recipe' onClick={() => form.removeListItem("Ingredients", index)} icon={<IconX />} ></IconButton>
        </InputGroup >
    ));

    return (
        <Box as="form" p={8} borderRadius="lg" boxShadow="base" mx="auto">
            <Heading size='md'>Add new Recipe</Heading>

            <Stack spacing='4'>
                <FormControl isRequired>
                    <FormLabel>Recipe Name</FormLabel>
                    <Input type='name'  {...form.getInputProps("name")} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea placeholder='Mexican dish' {...form.getInputProps("description")} />
                </FormControl>

                <FormLabel>Ingredients</FormLabel>
                {ingredients}

                <IconButton aria-label='Add recipe' onClick={() => form.insertListItem('Ingredients', { name: '', amount: '', description: "" })} icon={<IconPlus />} />

                <FormControl isRequired>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea placeholder='Boil eggs' />
                </FormControl>
            </Stack>
            <Button size="md" onClick={handleRecipeCreate} colorScheme='green'>Save</Button>
        </Box>
    )
}

export default CreateRecipe
