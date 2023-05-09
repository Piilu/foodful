import React, { type FunctionComponent } from 'react';
import { Card, CardBody, CardFooter, Button, Heading, Stack, Image, Text, Flex, Icon, MenuButton, Menu, MenuList, MenuItem, Portal, useDisclosure, useColorMode, Divider, Tooltip } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { IconBook, IconClock, IconDotsVertical, IconLicense, IconMessage } from '@tabler/icons-react';
import { ActionIcon, Group, MediaQuery } from '@mantine/core';
import CreateRecipe from './CreateRecipe';
import { useRouter } from 'next/router';
import { type FullRecipeData } from '~/constants/types';
import prettyMilliseconds from 'pretty-ms';
import Moment from 'react-moment';
import UserAvatar from '../profile/UserAvatar';

type RecipeProps = {
    horizontal?: boolean,
    recipe: FullRecipeData,
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
    const { isOpen, onOpen, onClose } = useDisclosure();

    const openRecipeView = () =>
    {
        void router.push(`/recipe/${recipe?.id}`, undefined);
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
                <Stack w={"100%"}  >
                    <CardBody  >
                        <Flex gap='2' >
                            <Heading size='md'>{recipe?.name}</Heading>
                            <Group position="left" opacity={0.7}>
                                <Tooltip openDelay={500} label="Total Time" placement="top">
                                    <Flex gap={1}>
                                        <IconClock size={18} color='green' />
                                        <Text fontSize={12} as={"b"}>{prettyMilliseconds(recipe?.totalTime * 60000)}</Text>
                                    </Flex>
                                </Tooltip>
                                <Tooltip openDelay={500} label="Total Ingridients" placement='top'>
                                    <Flex gap={1}>
                                        <IconBook size={18} color='orange' />
                                        <Text fontSize={12} as={"b"}>{recipe?.ingredients.length}</Text>
                                    </Flex>
                                </Tooltip>
                            </Group>
                            {isOwner ?
                                <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                                    <div>
                                        <Menu>
                                            <MenuButton as={ActionIcon}>
                                                <IconDotsVertical />
                                            </MenuButton>
                                            <Portal>
                                                <MenuList>
                                                    <MenuItem onClick={() => void openRecipeModal?.(recipe?.id)}>Edit</MenuItem>
                                                    <MenuItem color={"red"}>Delete</MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </div>
                                </MediaQuery>
                                : null}
                        </Flex>
                        <Group mt={5}>
                            <UserAvatar size="xs" user={recipe?.user} />
                            <Tooltip openDelay={500} placement='right' label={<Moment calendar>{recipe?.updatedAt}</Moment>}>
                                <Text color='gray.500' fontSize='sm'>
                                    <Moment fromNow>{recipe?.updatedAt}</Moment>
                                </Text>
                            </Tooltip>
                        </Group>

                        <Text fontSize={"sm"} mt={3} noOfLines={2} wordBreak={"break-word"}>
                            {recipe?.description}
                        </Text>

                    </CardBody>
                </Stack>
                <div>
                    <Flex direction={"column"} style={{ marginLeft: "auto" }}>
                        <CardBody>
                            {isOwner ?
                                <MediaQuery smallerThan={"xs"} styles={{ display: "none" }}>
                                    <div>
                                        <Menu>
                                            <MenuButton as={ActionIcon} ml={"auto"}>
                                                <IconDotsVertical />
                                            </MenuButton>
                                            <Portal>
                                                <MenuList>
                                                    <MenuItem onClick={() => void openRecipeModal?.(recipe?.id)}>Edit</MenuItem>
                                                    <MenuItem color={"red"}>Delete</MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </div>
                                </MediaQuery>
                                : null}

                        </CardBody>
                        <CardFooter gap={5}>
                            <Button w={"100%"} variant='ghost' leftIcon={<IconLicense />}>
                                Yum! {recipe?.Favorites?.length ?? 0}
                            </Button>
                            <Button onClick={openRecipeView} w={"100%"} colorScheme="orange">View Recipe</Button>
                        </CardFooter>
                    </Flex>
                </div>
            </Card >
        )
    }
    else
    {
        return (
            <>
                {isOpen ?
                    <CreateRecipe isOpen={isOpen} onClose={onClose} currentRecipe={recipe} isModal recipeId={recipe?.id} />
                    : null}
                <Card w={250} h={445} maxW="xs" >
                    <Image
                        src='https://images.pexels.com/photos/262905/pexels-photo-262905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                    />
                    <CardBody>
                        <Stack spacing='1'>
                            <Group >
                                <Heading size='md'>{recipe?.name}</Heading>
                                {isOwner ?
                                    <Menu>
                                        <MenuButton as={ActionIcon} ml={"auto"}>
                                            <IconDotsVertical />
                                        </MenuButton>
                                        <Portal>
                                            <MenuList>
                                                <MenuItem onClick={onOpen}>Edit</MenuItem>
                                                <MenuItem color={"red"}>Delete</MenuItem>
                                            </MenuList>
                                        </Portal>
                                    </Menu>

                                    : null}
                            </Group>
                            <Group mt={5}>
                                <UserAvatar size="xs" user={recipe?.user} />
                                <Tooltip openDelay={500} placement='right' label={<Moment calendar>{recipe?.updatedAt}</Moment>}>
                                    <Text color='gray.500' fontSize='sm'>
                                        <Moment fromNow>{recipe?.updatedAt}</Moment>
                                    </Text>
                                </Tooltip>
                            </Group>
                            <Divider />
                            <Group position="left" opacity={0.7}>
                                <Tooltip openDelay={500} label="Total Time" placement="top">

                                    <Flex gap={1}>
                                        <IconClock size={18} color='green' />
                                        <Text fontSize={12} as={"b"}>{prettyMilliseconds(recipe?.totalTime * 60000)}</Text>
                                    </Flex>
                                </Tooltip>
                                <Tooltip openDelay={500} label="Total Ingridients" placement='top'>
                                    <Flex gap={1}>
                                        <IconBook size={18} color='orange' />
                                        <Text fontSize={12} as={"b"}>{recipe?.ingredients.length}</Text>
                                    </Flex>
                                </Tooltip>
                            </Group>
                            <Text align={"center"} pt={2} fontSize={"sm"} noOfLines={3}>
                                {recipe?.description}
                            </Text>
                        </Stack>
                    </CardBody>
                    <CardFooter>
                        {/* <Button flex='2' variant='ghost' leftIcon={<IconLicense />}>
                            Yum! 5
                        </Button>
                        <Button flex='2' variant='ghost' leftIcon={<IconMessage />}>
                        </Button> */}
                        <Button w={"100%"} colorScheme="orange" onClick={openRecipeView}>View Recipe</Button>
                    </CardFooter>
                </Card>
            </>

        )
    }

}

export default Recipe;