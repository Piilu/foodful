import React, { FunctionComponent } from 'react';
import { Card, CardBody, CardFooter, Button, Heading, Stack, Image, Text, Flex, Box, Icon, Avatar, IconButton, border, MenuButton, Menu, MenuList, MenuItem, Portal, useDisclosure, useColorMode } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { IconClock, IconDotsVertical, IconLicense, IconMessage } from '@tabler/icons-react';
import { ActionIcon, Group, MediaQuery } from '@mantine/core';
import CreateRecipe from '../recipe/CreateRecipe';
import { Recipe as RecipePrisma } from '@prisma/client';
import { useRouter } from 'next/router';
import { FullRecipeData } from '~/constants/types';

type RecipeProps = {
    horizontal?: boolean,
    recipe: RecipePrisma,
    userId: string,
    openRecipeModal?: (id: number) => void,
}

const Recipe: FunctionComponent<RecipeProps> = (props) => 
{
    const { recipe, horizontal, userId, openRecipeModal } = props;
    const { data: session } = useSession();
    const isOwner = session?.user?.id == userId ?? false;
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const router = useRouter();

    const openRecipeView = () =>
    {
        void router.push(`/recipe/${recipe.id}`, undefined);
    }

    if (horizontal)
    {
        return (
            <Card
                mb={5}
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                    alt='Caffe Latte'
                />

                <Group>
                    <Stack w={"100%"} >
                        <CardBody>
                            <Flex gap='2' alignItems='center'>
                                <Heading size='md'>{recipe.name}</Heading>
                                <Icon boxSize={7} as={IconClock} color='green' />
                                <Text>60 min</Text>
                                {isOwner ?
                                    <MediaQuery largerThan={"xs"} styles={{ display: "none" }}>
                                        <Menu>
                                            <MenuButton as={ActionIcon}>
                                                <IconDotsVertical />
                                            </MenuButton>
                                            <Portal>
                                                <MenuList>
                                                    <MenuItem onClick={() => void openRecipeModal?.(recipe.id)}>Edit</MenuItem>
                                                    <MenuItem color={"red"}>Delete</MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </MediaQuery>
                                    : null}
                            </Flex>
                            <Text py='2'>
                                {recipe.description}
                            </Text>
                            <Button flex='2' variant='ghost' leftIcon={<IconMessage />}>
                            </Button>
                            <Button variant='ghost' leftIcon={<IconLicense />}>
                                Yum! 5
                            </Button>
                        </CardBody>
                    </Stack>
                </Group>
                <MediaQuery smallerThan={"xs"} styles={{ display: "none" }}>
                    <Flex direction={"column"} style={{ marginLeft: "auto" }}>
                        <CardBody>
                            {isOwner ?
                                <Menu>
                                    <MenuButton as={ActionIcon} ml={"auto"}>
                                        <IconDotsVertical />
                                    </MenuButton>
                                    <Portal>
                                        <MenuList>
                                            <MenuItem onClick={() => void openRecipeModal?.(recipe.id)}>Edit</MenuItem>
                                            <MenuItem color={"red"}>Delete</MenuItem>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                                : null}
                        </CardBody>
                        <CardBody>

                            <Button onClick={openRecipeView} colorScheme='green'>Open</Button>
                        </CardBody>
                    </Flex>
                </MediaQuery>
            </Card >
        )
    }
    else
    {

        return (
            <>
                <Card w={250} maxW="xs">
                    <Image
                        src='https://images.pexels.com/photos/262905/pexels-photo-262905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                    />
                    <CardBody>
                        <Stack spacing='2'>
                            <Flex flex='1' gap='2' alignItems='center' flexWrap='wrap'>
                                <Icon boxSize={7} as={IconClock} color='green' />
                                <Text>60 min</Text>
                            </Flex>
                            {/* <Heading size='md'>{recipe.name}</Heading> */}
                            <Text>
                                {recipe.description}
                            </Text>
                            <Text>
                                {/* {recipe.guidelines} */}
                            </Text>
                        </Stack>
                    </CardBody>
                    <CardFooter>
                        <Button flex='2' variant='ghost' leftIcon={<IconLicense />}>
                            Yum! 5
                        </Button>
                        <Button flex='2' variant='ghost' leftIcon={<IconMessage />}>
                        </Button>
                    </CardFooter>
                </Card>
            </>

        )
    }

}

export default Recipe;