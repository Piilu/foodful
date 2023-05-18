import React, { type FunctionComponent } from 'react';
import { Card, CardBody, CardFooter, Button, Heading, Stack, Image, Text, Flex, Icon, MenuButton, Menu, MenuList, MenuItem, Portal, useDisclosure, useColorMode, Divider, Tooltip, AspectRatio } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { IconBook, IconClock, IconDotsVertical, IconLicense, IconMessage } from '@tabler/icons-react';
import { ActionIcon, Group, MediaQuery } from '@mantine/core';
import CreateRecipe from './CreateRecipe';
import { useRouter } from 'next/router';
import { type FullRecipeData } from '~/constants/types';
import prettyMilliseconds from 'pretty-ms';
import Moment from 'react-moment';
import UserAvatar from '../profile/UserAvatar';
import RecipeImage from './RecipeImage';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import DeleteButton from './DeleteButton';

type RecipeProps = {
    horizontal?: boolean,
    recipe: FullRecipeData,
    userId: string,
    openRecipeModal?: (id: number | undefined) => void,
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

    if (horizontal)
    {
        return (
            <Card
                mb={5}
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
            >
                <AspectRatio ratio={16 / 9} w={{ base: '100%', sm: "25%" }} >
                    <RecipeImage isListItem imageName={recipe?.imageFullName ?? ""} recipeName={recipe?.name ?? ""} />
                </AspectRatio>
                <Stack w={"100%"}  >
                    <CardBody  >
                        <Flex gap='2' >
                            <Heading size='md' wordBreak={"break-all"} maxW={"100%"}>{recipe?.name}</Heading>
                            <Group position="left" opacity={0.7}>
                                <Tooltip openDelay={500} label="Total Time" placement="top">
                                    <Flex gap={1}>
                                        <IconClock size={18} color='green' />
                                        <Text fontSize={12} as={"b"}>{prettyMilliseconds(recipe?.totalTime * 60000)} test</Text>
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
                                                    <DeleteButton recipeId={recipe?.id ?? -1} />
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
                                                    <DeleteButton recipeId={recipe?.id ?? -1} />
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </div>
                                </MediaQuery>
                                : null}

                        </CardBody>
                        <CardFooter gap={5}>
                            <Group w={"100%"} position='center'>
                                <FavoriteButton recipeId={recipe?.id ?? -1} count={recipe?.Favorites.length ?? 0} isFavorite={recipe?.Favorites.some(favorite => (favorite.userId == session?.user.id ? true : false)) ?? false} />
                                <Link style={{ width: "100%" }} href={`/recipe/${recipe?.id ?? "-1"}`}>
                                    <Button w={"100%"} colorScheme="orange">View Recipe</Button>
                                </Link>
                            </Group>
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
                    <CreateRecipe isOpen={isOpen} onClose={onClose} currentRecipe={recipe} isModal />
                    : null}
                <Card w={250} h={445} maxW="xs" >
                    <AspectRatio ratio={16 / 9} w={{ base: '100%' }} >
                        <RecipeImage imageName={recipe?.imageFullName ?? ""} recipeName={recipe?.name ?? ""} />
                    </AspectRatio>
                    <CardBody>
                        <Stack spacing='1'>
                            <Group noWrap >
                                <Heading title={recipe?.name} noOfLines={2} size='md' wordBreak={"break-all"} maxW={"100%"}>{recipe?.name}</Heading>
                                {isOwner ?
                                    <Menu>
                                        <MenuButton as={ActionIcon} ml={"auto"}>
                                            <IconDotsVertical />
                                        </MenuButton>
                                        <Portal>
                                            <MenuList>
                                                <MenuItem onClick={onOpen}>Edit</MenuItem>
                                                <DeleteButton recipeId={recipe?.id ?? -1} />
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
                        <Link style={{ width: "100%" }} href={`/recipe/${recipe?.id ?? "-1"}`}>
                            <Button w={"100%"} colorScheme="orange">View Recipe</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </>

        )
    }

}

export default Recipe;