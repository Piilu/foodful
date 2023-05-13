import { Heading, Stack, FormControl, FormLabel, Box, Input, List, Textarea, InputGroup, IconButton, Button, Modal, useToast, AlertIcon, Divider, Alert, AlertDescription, AlertTitle, ListItem, ListIcon, ModalFooter, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Flex, Badge, Card, Image, Text, SimpleGrid } from '@chakra-ui/react'
import { useForm } from '@mantine/form';
import { AspectRatio, Center, FileButton, Grid, Group } from '@mantine/core';
import { IconPlus, IconX, IconGripVertical, IconAsterisk } from '@tabler/icons-react'
import React, { type FunctionComponent, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios, { type AxiosError } from 'axios';
import { EndPoint } from '~/constants/EndPoints';
import { type RecipeReqCreateType, type RecipeResCreateType } from '~/pages/api/recipe';
import { type Instruction, type ingredients } from '@prisma/client';
import { type FullRecipeData } from '~/constants/types';
import { useRouter } from 'next/router';
import IngredientsInput from './IngridientsInput';
import InstructionsInput from './InstructionsInput';
import ImageBadge from './ImageBadge';
import { storage } from '~/server/firebase';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid"
import { number } from 'zod';
import { updateRecipeImage } from '~/utils/queries/update-image';
import RecipeImage from './RecipeImage';
import GeneralInput from './GeneralInput';

type CreateRecipeType = {
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    currentRecipe: FullRecipeData | null;
}
const CreateRecipe: FunctionComponent<CreateRecipeType> = (props) =>
{
    const { isOpen, onClose, isModal, currentRecipe } = props;
    const [winReady, setWinReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipeId, setRecipeId] = useState<number | null>(currentRecipe?.id ?? null);
    const [custom, setCustom] = useState(false);
    const [errors, setErrors] = useState<string[] | []>([]);
    const [currentImage, setCurrentImage] = useState<string | null>(currentRecipe?.imageUrl ?? null);
    const [selectedFile, setSelectedFile] = useState(null);
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
            instructions: (values) => (values?.every(value => value.step !== "") && values.length > 0 ? null : "Every instruction needs to have a step and recipe has to have at least one instruction"),
            totalTime: (value) => (value != null && value != 0 ? null : "Total time is required"),
        },
    });

    useEffect(() => { setWinReady(true); fillUpdateForm() }, []);

    //#region Setup custom components for
    const ingredients = form.values.Ingredients?.map((item, index) => (
        <IngredientsInput setCustom={setCustom} custom={custom} key={`${index}-ingridients`} index={index} form={form} />
    ));

    const instructions = form.values.instructions?.map((item, index) => (
        <Draggable key={`${index}-instructions`} index={index} draggableId={index.toString()} >
            {(provided) => (
                <InstructionsInput custom={custom} setCustom={setCustom} index={index} form={form} provided={provided} />
            )}
        </Draggable>
    ));
    //#endregion

    //#region Helper functions

    const handleUpload = async (uploadRecipeId: number) =>
    {
        const imageRef = ref(storage, `images/${selectedFile?.name + v4()}`);

        await uploadBytes(imageRef, selectedFile).then((resFile) =>
        {
            updateRecipeImage(uploadRecipeId, resFile.metadata.fullPath, resFile.metadata.name).then((res) =>
            {
                if (res)
                {
                    setCurrentImage(resFile.metadata.fullPath ?? null);
                    setSelectedFile(null);
                    void router.replace(router.asPath, undefined, { scroll: false });
                }
                else
                {

                    throw new Error("Image upload failed");
                }

            }).catch((err) => { throw new Error("Image upload failed"); })



        }).catch((err) =>
        {
            toast({
                title: "Image upload failed",
                description: "Image upload failed",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }

    const fillUpdateForm = () =>
    {
        form.setValues({
            name: currentRecipe?.name as string,
            description: currentRecipe?.description ?? "",
            totalTime: currentRecipe?.totalTime ?? 0,
            instructions: currentRecipe?.instructions ?? [],
            Ingredients: currentRecipe?.ingredients ?? [],
        })
        setTitle(currentRecipe?.name ?? "Add new Recipe");
        setRecipeId(currentRecipe?.id ?? null);
        setCustom(true);
        form.resetDirty();
    }

    //#endregion



    const handleRecipeSubmit = async (event: React.FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault();
        setErrors([]);
        if (form.isValid() === false)
        {
            const errors = form.validate().errors;
            const errorList = Object.keys(errors).map((key) => errors[key]) as string[];
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
                    if (selectedFile != null)
                    {
                        void handleUpload(newData.fullRecipeData?.id as number);
                    }
                    else
                    {

                        void router.replace(router.asPath, undefined, { scroll: false });
                    }
                    onClose();
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
            })
        }
        else
        {
            await axios.put(`${window.origin}${EndPoint.RECIPE}`, data).then((res) =>
            {
                const newData = res.data as RecipeResCreateType;
                if (newData.success)
                {
                    if (selectedFile != null)
                    {
                        void handleUpload(newData.fullRecipeData?.id as number);
                    }
                    else
                    {
                        void router.replace(router.asPath, undefined, { scroll: false });
                    }
                    setTitle(newData.fullRecipeData?.name ?? "Add new Recipe");
                    toast({
                        title: `Recipe ${currentRecipe?.name ?? ""} updated`,
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
                    });
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
            })
        }

        setLoading(false);
    }

    const handleRecipeModalClose = () =>
    {
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
                                <SimpleGrid columns={2} spacing={5}>
                                    <GeneralInput form={form} custom={custom} setCustom={setCustom} />
                                    <FormControl>
                                        <FormLabel>Image</FormLabel>
                                        <Group>
                                            <FileButton size={"md"} onChange={setSelectedFile} accept="image/png,image/jpeg">
                                                {(props) => <Button {...props}>Upload image</Button>}
                                            </FileButton>
                                            {selectedFile == null ?
                                                <AspectRatio ratio={16 / 9} w={{ base: '100%' }} >
                                                    <RecipeImage recipeName={currentRecipe?.name ?? ""} imageName={currentImage ?? ""} />
                                                </AspectRatio>
                                                :
                                                <AspectRatio ratio={16 / 9} w={{ base: '100%' }} >
                                                    <Image
                                                        objectFit='cover'
                                                        src={window.URL.createObjectURL(selectedFile)}
                                                        alt={currentRecipe?.name ?? ""}
                                                    />
                                                </AspectRatio>
                                            }
                                        </Group>

                                        {selectedFile && (
                                            <Text size="sm" align="center" mt="sm">
                                                Picked file: {selectedFile.name}
                                            </Text>
                                        )}

                                    </FormControl>
                                </SimpleGrid>

                                <Heading as='h4' size='md'>Ingredients</Heading>
                                {ingredients}
                                <IconButton aria-label='Add recipe' onClick={() => form.insertListItem('Ingredients', { name: '', amount: '', description: "" })} icon={<IconPlus />} />
                                <Divider />
                                <Flex gap={1}>
                                    <Heading as='h4' size='md'>Instructions</Heading>
                                    <IconAsterisk color='#E4787A' size={10} />
                                </Flex>
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
                    <SimpleGrid columns={2} spacing={5}>
                        <GeneralInput form={form} custom={custom} setCustom={setCustom} />
                        <FormControl>
                            <FormLabel>Image</FormLabel>
                            <Group>
                                <FileButton size={"md"} onChange={setSelectedFile} accept="image/png,image/jpeg">
                                    {(props) => <Button {...props}>Upload image</Button>}
                                </FileButton>
                                {selectedFile == null ?
                                    <AspectRatio ratio={16 / 9} w={{ base: '100%' }} >
                                        <RecipeImage recipeName={currentRecipe?.name ?? ""} imageName={currentImage ?? ""} />
                                    </AspectRatio>
                                    :
                                    <AspectRatio ratio={16 / 9} w={{ base: '100%' }} >
                                        <Image
                                            objectFit='cover'
                                            src={window.URL.createObjectURL(selectedFile)}
                                            alt={currentRecipe?.name ?? ""}
                                        />
                                    </AspectRatio>
                                }
                            </Group>

                            {selectedFile && (
                                <Text size="sm" align="center" mt="sm">
                                    Picked file: {selectedFile.name}
                                </Text>
                            )}

                        </FormControl>
                    </SimpleGrid>

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
                    <Button form='createRecipe' isLoading={loading} ml={"auto"} size="md" type='submit' colorScheme='green'>{recipeId === null ? "Add new recipe" : "Update"}</Button>
                </Stack>
            </form>
        )
    }
}

export default CreateRecipe
