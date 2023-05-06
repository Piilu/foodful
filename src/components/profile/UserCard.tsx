import { Card, CardBody, Stack, Box, Heading, Flex, Avatar, Center, CardFooter, ButtonGroup, Button, useDisclosure } from '@chakra-ui/react'
import { ActionIcon, Group, Text } from '@mantine/core'
import { User } from '@prisma/client'
import { IconEdit } from '@tabler/icons-react'
import React, { FunctionComponent, useEffect, useState } from 'react'
import StatCard from './StatText'
import StatText from './StatText'
import PromoLink from './PromoLink'
import EditProfile from './EditProfile'
import { getUserCount } from '~/utils/queries/get-user-count'
import { UserCountResType } from '~/pages/api/user/count'

type UserCardType = {
    user: User,
    grow?: boolean,
    isProfileUser: boolean,
}

const UserCard: FunctionComponent<UserCardType> = (props) =>
{
    const { user, grow, isProfileUser } = props;
    const [recipeCount, setRecipeCount] = useState<number>()
    const [favorites, setFavorites] = useState<number>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() =>
    {
        getCount();
    }, [])
    const getCount = async () =>
    {
        const data: UserCountResType = await getUserCount(user.id);
        setRecipeCount(data.recipes)
        setFavorites(data.favorites)
    }
    return (
        <>
            <EditProfile user={user} isModal isOpen={isOpen} onClose={onClose} />
            <Card w={grow ? "100%" : "md"}>
                <CardBody>
                    <Stack spacing="3">
                        <Flex direction={"column"}>
                            <Flex gap={10}>
                                <Box >
                                    <Avatar
                                        size="lg"
                                        name={user.name}
                                        src={user.image}
                                    />
                                </Box>
                                <Flex flexWrap="nowrap" gap={5} >
                                    <Flex gap={4} direction={"column"}>
                                        <Heading size="md">
                                            <Group noWrap>
                                                {user.name}
                                                {isProfileUser ?
                                                    <ActionIcon onClick={onOpen}>
                                                        <IconEdit size={20} />
                                                    </ActionIcon>
                                                    : null}
                                            </Group>
                                        </Heading>
                                        <Group>
                                            <StatText label='Recipes' value={recipeCount} />
                                            <StatText label='Favorites' value={favorites} />
                                            <PromoLink link={user.website} />
                                        </Group>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                        {user.bio?.length !== 0 && user.bio !== null ? <Text align={"center"}>{user.bio}</Text> : <Text ta="center" fz="sm" c="dimmed">User has not written a bio yet.</Text>}

                    </Stack>
                </CardBody>
                {/* <CardFooter>
                <ButtonGroup mx="auto" spacing="2">
                    <Button size="sm" colorScheme="green">
                        Retseptid
                    </Button>
                    <Button size="sm" colorScheme="green">
                        Lemmikud
                    </Button>
                </ButtonGroup>
            </CardFooter> */}
            </Card >
        </>
    )
}

export default UserCard
