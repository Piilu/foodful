import { Heading, Stack, FormControl, FormLabel, Box, Input, Textarea, InputGroup, IconButton, Button, Modal, FormHelperText, Text, Flex, useToast, Wrap, WrapItem, AlertIcon, Divider, Alert, AlertDescription, AlertTitle, List, ListItem, ListIcon, ModalFooter, ModalHeader, useDisclosure, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { ActionIcon, Center, Group, Grid } from '@mantine/core';
import { IconPlus, IconX, IconGripVertical, IconSearch } from '@tabler/icons-react'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { RecipeReqCreateType, RecipeResCreateType } from '~/pages/api/recipe';
import { Instruction, ingredients } from '@prisma/client';
import { FullRecipeData } from '~/constants/types';
import { getRecipe } from '~/utils/queries/get-recipe';
import { useRouter } from 'next/router';

type CreateRecipeType = {
    isModal?: boolean;
    isOpen?: boolean;
    recipeId?: number | null;
    onClose?: () => void;
}
const CreateRecipe: FunctionComponent<CreateRecipeType> = (props) =>
{
    const { isOpen, onClose, isModal, recipeId } = props;
    const [winReady, setWinReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [title, setTitle] = useState<"Add new Recipe" | string>("Add new Recipe");
    const [currentRecipe, setCurrentRecipe] = useState<FullRecipeData | null>(null);
    const router = useRouter();
    const toast = useToast();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            totalTime: 0,
            Ingredients: [
            ],
            instructions: [
            ],
        },

        validate: {
            name: (value) => (value.length >= 3 && value.length <= 150 ? null : "Name has to be between 3 and 150 characters"),
            instructions: (values) => (values.every(value => value.step !== "") && values.length > 0 ? null : "Every instruction needs to have a step and recipe has to have at least one instruction"),
            totalTime: (value) => (value != null && value != 0 ? null : "Total time is required"),
        },
    });

    useEffect(() => { setWinReady(true); }, []);

    //It's doing double request to get data (but its okay for now)
    useEffect(() =>
    {
        if (recipeId != null && isOpen && currentRecipe?.id !== recipeId)
        {
            queryRecipe();
        }
        setTitle(currentRecipe?.name ?? "Add new Recipe");

        form.setValues({
            name: currentRecipe?.name ?? "",
            description: currentRecipe?.description ?? "",
            totalTime: currentRecipe?.totalTime ?? 0,
            Ingredients: currentRecipe?.ingredients ?? [
            ],
            instructions: currentRecipe?.instructions ?? [
            ],
        });

    }, [isOpen, currentRecipe?.id]);

    const queryRecipe = async () =>
    {
        setCurrentRecipe(await getRecipe(recipeId));
        console.log(form.values);
    }

    const handleRecipeSubmit = async (event: React.FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault();
        setErrors([]);
        if (form.isValid() === false)
        {
            const errors = form.validate().errors;
            console.log(errors)
            const errorList = Object.keys(errors).map((key) => errors[key]);
            console.log(errorList);
            setErrors(errorList);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const instructionsPriority = form.values.instructions.map((item, index) => ({ ...item, priority: index }));
        const IngredientsPriority = form.values.Ingredients.map((item, index) => ({ ...item, priority: index }));
        const data: RecipeReqCreateType = {
            name: form.values.name,
            description: form.values.description,
            totalTime: form.values.totalTime != null ? parseInt(form.values.totalTime) : null,
            instructions: instructionsPriority as Instruction[],
            ingredients: IngredientsPriority as ingredients[],
        }
        setLoading(true);
        if (recipeId === null)
        {

            await axios.post(`${window.origin}${EndPoint.RECIPE}`, data).then((res) =>
            {
                const newData = res.data as RecipeResCreateType;
                if (newData.success)
                {
                    void router.replace(router.asPath, undefined, { scroll: false });
                    toast({
                        title: "Recipe created",
                        description: "Recipe was created successfully",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                }
                else
                {
                    toast({
                        title: "Recipe creation failed",
                        description: newData.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }).catch((err) =>
            {
                toast({
                    title: "Recipe creation failed",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }).finally(() => setLoading(false));
        }
        else
        {
            await axios.put(`${window.origin}${EndPoint.RECIPE}`, data).then((res) =>
            {
                const newData = res.data as RecipeResCreateType;
                if (newData.success)
                {
                    void router.replace(router.asPath, undefined, { scroll: false });
                    toast({
                        title: `Recipe ${currentRecipe?.recipe?.name ?? ""} updated`,
                        description: "Recipe was updated successfully",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                }
                else
                {
                    toast({
                        title: "Recipe update failed",
                        description: newData.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }).catch((err) =>
            {
                toast({
                    title: "Recipe creation failed",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }).finally(() => setLoading(false));
        }

    }

    const ingredients = form.values.Ingredients.map((item, index) => (
        // eslint-disable-next-line react/jsx-key
        <Grid key={index} grow>
            <Divider />
            <Grid.Col span={3} miw={"15em"}>
                <FormControl >
                    <FormLabel>Name</FormLabel>
                    <Input  {...form.getInputProps(`Ingredients.${index}.name`)} placeholder='Eggs' />
                </FormControl>
            </Grid.Col>
            <Grid.Col span={5} miw={"15em"}>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input {...form.getInputProps(`Ingredients.${index}.description`)} placeholder='Details' />
                </FormControl>
            </Grid.Col>
            <Grid.Col span={2} miw={"15em"}>
                <FormControl >
                    <FormLabel>Amount</FormLabel>
                    <Input {...form.getInputProps(`Ingredients.${index}.amount`)} placeholder='2tk' />
                </FormControl></Grid.Col>
            <Grid.Col span={1} mt={"auto"} miw={"5em"}>
                <FormControl >
                    <IconButton w={"100%"} mt={"auto"} aria-label='Remove recipe' onClick={() => form.removeListItem("Ingredients", index)} icon={<IconX />} ></IconButton>
                </FormControl></Grid.Col>
        </Grid>


    ));

    const instructions = form.values.instructions.map((item, index) => (
        // eslint-disable-next-line react/jsx-key
        <Draggable key={index} index={index} draggableId={index.toString()} >
            {(provided) => (
                <InputGroup mb={2} ref={provided.innerRef} {...provided.draggableProps} gap={5}>
                    <Center {...provided.dragHandleProps}>
                        <IconGripVertical size="1.2rem" />
                    </Center>
                    <Input {...form.getInputProps(`instructions.${index}.step`)} placeholder='Step' />
                    <IconButton aria-label='Remove recipe' onClick={() => form.removeListItem("instructions", index)} icon={<IconX />} ></IconButton>
                </InputGroup >
            )}
        </Draggable>
    ));

    if (isModal)
    {
        return (
            <Modal isOpen={isOpen as boolean} onClose={onClose as (() => void)} size='6xl' scrollBehavior={"inside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>{title}</ModalHeader>
                    <ModalBody>
                        <form id="createRecipe" onSubmit={(e) => handleRecipeSubmit(e)}>
                            {errors.length !== 0 ?
                                <Alert borderRadius={15} status='error'>
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle>Error creating a recipe!</AlertTitle>
                                        <AlertDescription>

                                            <List>
                                                {errors.length !== 0 ? errors.map((error, index) => (
                                                    <ListItem key={index.toString() + "error"}>
                                                        <ListIcon as={IconX} color='red' />
                                                        {error}
                                                    </ListItem>
                                                )) : null}
                                            </List>
                                        </AlertDescription>
                                    </Box>
                                </Alert>

                                : null}
                            <Stack spacing='4'>
                                <FormControl isRequired>
                                    <FormLabel>Recipe Name</FormLabel>
                                    <Input type='name'  {...form.getInputProps("name")} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel mb={0}>Total time (<small style={{ margin: 0 }}>In minutes</small>)</FormLabel>
                                    <Input type='number'  {...form.getInputProps("totalTime")} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea placeholder='Mexican dish' {...form.getInputProps("description")} />
                                </FormControl>

                                <Heading as='h4' size='md'>Ingredients</Heading>
                                {ingredients}
                                <IconButton aria-label='Add recipe' onClick={() => form.insertListItem('Ingredients', { name: '', amount: '', description: "" })} icon={<IconPlus />} />
                                <Divider />
                                <Heading as='h4' size='md'>Instructions</Heading>
                                <small style={{ margin: 0 }}>The order everthing has to be done</small>
                                <DragDropContext
                                    onDragEnd={({ destination, source }) =>
                                        form.reorderListItem('instructions', { from: source.index, to: destination?.index })
                                    }
                                >
                                    <Droppable droppableId="dnd-list" direction="vertical">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {winReady ? instructions : null}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>

                                <IconButton aria-label='Add instruction' onClick={() => form.insertListItem('instructions', { step: "" })} icon={<IconPlus />} />

                            </Stack>

                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button form='createRecipe' isLoading={loading} ml={"auto"} size="md" type='submit' colorScheme='green'>{recipeId === null ? "Add new recipe" : "Update"}</Button>

                    </ModalFooter>
                </ModalContent>
            </Modal >
        );
    }
    else
    {
        return (
            <form onSubmit={(e) => handleRecipeSubmit(e)}>
                {errors.length !== 0 ?
                    <Alert borderRadius={15} status='error'>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Error creating a recipe!</AlertTitle>
                            <AlertDescription>

                                <List>
                                    {errors.length !== 0 ? errors.map((error, index) => (
                                        <ListItem key={index.toString() + "error"}>
                                            <ListIcon as={IconX} color='red' />
                                            {error}
                                        </ListItem>
                                    )) : null}
                                </List>
                            </AlertDescription>
                        </Box>
                    </Alert>
                    : null}
                <Heading mb={5} size='xl'>{title}</Heading>

                <Stack spacing='4'>
                    <FormControl isRequired>
                        <FormLabel>Recipe Name</FormLabel>
                        <Input type='name'  {...form.getInputProps("name")} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mb={0}>Total time (<small style={{ margin: 0 }}>In minutes</small>)</FormLabel>
                        <Input type='number'  {...form.getInputProps("totalTime")} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder='Mexican dish' {...form.getInputProps("description")} />
                    </FormControl>

                    <Heading as='h4' size='md'>Ingredients</Heading>
                    {ingredients}
                    <IconButton aria-label='Add recipe' onClick={() => form.insertListItem('Ingredients', { name: '', amount: '', description: "" })} icon={<IconPlus />} />
                    <Divider />
                    <Heading as='h4' size='md'>Instructions</Heading>
                    <small style={{ margin: 0 }}>The order everthing has to be done</small>
                    <DragDropContext
                        onDragEnd={({ destination, source }) =>
                            form.reorderListItem('instructions', { from: source.index, to: destination?.index })
                        }
                    >
                        <Droppable droppableId="dnd-list" direction="vertical">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {winReady ? instructions : null}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <IconButton aria-label='Add instruction' onClick={() => form.insertListItem('instructions', { step: "" })} icon={<IconPlus />} />

                </Stack>
                <Stack spacing='4' mt={5}>
                    <Button isLoading={loading} ml={"auto"} size="md" type='submit' colorScheme='green'>Save</Button>
                </Stack>
            </form>
        )
    }
}

export default CreateRecipe
