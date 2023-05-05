import { Heading, Stack, FormControl, FormLabel, Box, Input, Textarea, InputGroup, IconButton, Button } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { ActionIcon, Center } from '@mantine/core';
import { IconPlus, IconX, IconGripVertical } from '@tabler/icons-react'
import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
            instructions: [
                { step: 'Muna' },
                { name: 'Muna' },
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
            <Input {...form.getInputProps(`Ingredients.${index}.name`)} w={400} placeholder='Eggs, Bacon, Sauce' />
            <Input {...form.getInputProps(`Ingredients.${index}.amount`)} w={200} placeholder='2g' />
            <Input {...form.getInputProps(`Ingredients.${index}.description`)} w={200} placeholder='Small detail' />
            <IconButton aria-label='Remove recipe' onClick={() => form.removeListItem("Ingredients", index)} icon={<IconX />} ></IconButton>
        </InputGroup >
    ));

    const instructions = form.values.instructions.map((item, index) => (
        // eslint-disable-next-line react/jsx-key
        <Draggable key={index} index={index} draggableId={index.toString()} >
            {(provided) => (
                <InputGroup ref={provided.innerRef} {...provided.draggableProps} gap={5}>
                    <Center {...provided.dragHandleProps}>
                        <IconGripVertical size="1.2rem" />
                    </Center>
                    <Input {...form.getInputProps(`instructions.${index}.step`)} placeholder='Step' />
                    <IconButton aria-label='Remove recipe' onClick={() => form.removeListItem("instructions", index)} icon={<IconX />} ></IconButton>
                </InputGroup >
            )}
        </Draggable>
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

                <DragDropContext onDragEnd={({ destination, source }) =>
                    form.reorderListItem('instructions', { from: source.index, to: destination.index })
                }>
                    <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {instructions}
                                {provided.placeholder}
                            </div>
                        )}

                    </Droppable>
                </DragDropContext>

                <IconButton aria-label='Add instruction' onClick={() => form.insertListItem('instructions', { step: "" })} icon={<IconPlus />} />

            </Stack>
            <Button size="md" onClick={handleRecipeCreate} colorScheme='green'>Save</Button>
        </Box>
    )
}

export default CreateRecipe
