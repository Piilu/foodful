import { Heading, Stack, FormControl, FormLabel, Box, Input, Textarea, InputGroup, IconButton, Button, Modal, useToast, AlertIcon, Divider, Alert, AlertDescription, AlertTitle, List, ListItem, ListIcon, ModalFooter, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { Center, Grid } from '@mantine/core';
import { IconPlus, IconX, IconGripVertical } from '@tabler/icons-react'
import React, { type FunctionComponent, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios, { type AxiosError } from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { type RecipeReqCreateType, type RecipeResCreateType } from '~/pages/api/recipe';
import { type Instruction, type ingredients } from '@prisma/client';
import { type FullRecipeData } from '~/constants/types';
import { useRouter } from 'next/router';
import IngridientsInput from './IngridientsInput';

type CreateRecipeType = {
    isModal?: boolean;
    isOpen?: boolean;
    recipeId?: number | null;
    onClose?: () => void;
    currentRecipe: FullRecipeData | null;
}
const CreateRecipe: FunctionComponent<CreateRecipeType> = (props) =>
{
    const { isOpen, onClose, isModal, recipeId, currentRecipe } = props;
    const [winReady, setWinReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[] | []>([]);
    const [title, setTitle] = useState<"Add new Recipe" | string>(currentRecipe?.name ?? "Add new Recipe");
    const router = useRouter();
    const toast = useToast();
    const form = useForm({
        initialValues: {
            name: currentRecipe?.name ?? "",
            description: currentRecipe?.description ?? "",
            totalTime: currentRecipe?.totalTime ?? 0,
            Ingredients: currentRecipe?.ingredients ?? [
            ],
            instructions: currentRecipe?.instructions ?? [
            ],
        },

        validate: {
            name: (value) => (value.length >= 3 && value.length <= 150 ? null : "Name has to be between 3 and 150 characters"),
            instructions: (values) => (values.every(value => value.step !== "") && values.length > 0 ? null : "Every instruction needs to have a step and recipe has to have at least one instruction"),
            totalTime: (value) => (value != null && value != 0 ? null : "Total time is required"),
        },
    });

    useEffect(() => { setWinReady(true); console.log("USEEFFECT TRIGGERED") }, []);


    const handleRecipeSubmit = async (event: React.FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault();
        setErrors([]);
        if (form.isValid() === false)
        {
            const errors = form.validate().errors;
            console.log(errors)
            const errorList = Object.keys(errors).map((key) => errors[key]) as string[];
            console.log(errorList);
            setErrors(errorList);
            return;
        }

        const instructionsPriority = form.values.instructions.map((item, index) => ({ ...item, priority: index }));
        const IngredientsPriority = form.values.Ingredients.map((item, index) => ({ ...item, priority: index }));


        const data: RecipeReqCreateType = {
            name: form.values.name,
            description: form.values.description,
            totalTime: form.values.totalTime != null ? parseInt(form.values.totalTime.toString()) : null,
            instructions: instructionsPriority as Instruction[],
            ingredients: IngredientsPriority as ingredients[],
            recipeId: recipeId ?? null,
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
                    setTitle(newData?.fullRecipeData?.name ?? "Add new Recipe");
                    form.setValues({
                        name: newData?.fullRecipeData?.name as string,
                        description: newData?.fullRecipeData?.description ?? "",
                        totalTime: newData?.fullRecipeData?.totalTime ?? 0,
                        instructions: newData?.fullRecipeData?.instructions,
                        Ingredients: newData?.fullRecipeData?.ingredients,
                    })
                    form.resetDirty();
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
            }).catch((err: Error | AxiosError) =>
            {
                toast({
                    title: "Recipe creation failed",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }).finally(() =>
            {
                setLoading(false);
            });
        }
        else
        {
            await axios.put(`${window.origin}${EndPoint.RECIPE}`, data).then((res) =>
            {
                const newData = res.data as RecipeResCreateType;
                if (newData.success)
                {
                    setTitle(newData?.fullRecipeData?.name ?? "Add new Recipe");

                    void router.replace(router.asPath, undefined);
                    
                    form.setValues({
                        name: newData?.fullRecipeData?.name as string,
                        description: newData?.fullRecipeData?.description ?? "",
                        totalTime: newData?.fullRecipeData?.totalTime ?? 0,
                        instructions: newData?.fullRecipeData?.instructions,
                        Ingredients: newData?.fullRecipeData?.ingredients,
                    })
                    toast({
                        title: `Recipe ${currentRecipe?.name ?? ""} updated`,
                        description: "Recipe was updated successfully",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    console.log("DIRTY5555555555", form.isDirty());
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
            }).catch((err: Error | AxiosError) =>
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

    const handleRecipeModalClose = () =>
    {
        // console.log("DIRTY2", form.isDirty());
        // if (form.isDirty())
        // {
        //     const result = confirm("Are you sure you want to close? All unsaved changes will be lost");
        //     console.log(result);
        //     if (result)
        //     {
        //         onClose?.();
        //         form.reset();
        //         setErrors([]);
        //     }
        //     return;
        // }
        onClose?.();
    }

    const ingredients = form.values.Ingredients?.map((item, index) => (
        <IngridientsInput key={`${index}-ingridients`} index={index} form={form} />
    ));

    const instructions = form.values.instructions?.map((item, index) => (
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
            <Modal motionPreset="slideInBottom" isOpen={isOpen as boolean} onClose={handleRecipeModalClose} size='6xl' scrollBehavior={"inside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>{title}</ModalHeader>
                    <ModalBody>
                        <form id="createRecipe" onSubmit={(e) => void handleRecipeSubmit(e)}>
                            {errors?.length !== 0 ?
                                <Alert borderRadius={15} status='error'>
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle>Error creating a recipe!</AlertTitle>
                                        <AlertDescription>

                                            <List>
                                                {errors?.length !== 0 ? errors?.map((error, index) => (
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
                                        form.reorderListItem('instructions', { from: source.index, to: destination?.index ?? 0 })
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
            <form onSubmit={(e) => void handleRecipeSubmit(e)}>
                {errors?.length !== 0 ?
                    <Alert borderRadius={15} status='error'>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Error creating a recipe!</AlertTitle>
                            <AlertDescription>

                                <List>
                                    {errors?.length !== 0 ? errors?.map((error, index) => (
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
                            form.reorderListItem('instructions', { from: source.index, to: destination?.index ?? 0 })
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
