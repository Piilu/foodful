import { Heading, Stack, FormControl, FormLabel, Box, Input, Textarea, InputGroup, IconButton, Button } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react'
import React from 'react'

const CreateRecipe = () =>
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
        },

        validate: {
            name: (value) => (value.length > 3 && value.length <= 150 ? null : "Name has to be between 3 and 150 characters"),
        },
    });
    return (
        <Box as="form" p={8} borderRadius="lg" boxShadow="base" maxWidth="500px" mx="auto">
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
                <InputGroup>
                    <Input type='ingredients' placeholder='Eggs, Bacon, Sauce' />
                    <IconButton aria-label='Add to friends' icon={<IconPlus />} />
                </InputGroup>

                <FormControl isRequired>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea placeholder='Boil eggs' />
                </FormControl>
            </Stack>
            <Button size="md" colorScheme='green'>Save</Button>
        </Box>
    )
}

export default CreateRecipe
