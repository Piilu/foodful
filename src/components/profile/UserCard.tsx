import { Card, CardBody, Stack, Box, Heading, Flex, Avatar, Center, CardFooter, ButtonGroup, Button, useDisclosure } from '@chakra-ui/react'
import { ActionIcon, Group, Text } from '@mantine/core'
import { type User } from '@prisma/client'
import { IconEdit } from '@tabler/icons-react'
import React, { type FunctionComponent, useEffect, useState } from 'react'
import StatCard from './StatText'
import StatText from './StatText'
import PromoLink from './PromoLink'
import EditProfile from './EditProfile'
import { getUserCount } from '~/utils/queries/get-user-count'
import { type UserCountResType } from '~/pages/api/user/count'
import Link from 'next/link'
import { useRouter } from 'next/router'

type UserCardType = {
    user: User,
    grow?: boolean,
    isProfileUser: boolean,
    isPopover?: boolean,
}

const UserCard: FunctionComponent<UserCardType> = (props) =>
{
    const { user, grow, isProfileUser, isPopover } = props;
    const [recipeCount, setRecipeCount] = useState<number>()
    const [favorites, setFavorites] = useState<number>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()
    useEffect(() =>
    {
        void getCount();
    }, [router])
    const getCount = async () =>
    {
        const data: UserCountResType = await getUserCount(user.id) as UserCountResType;
        setRecipeCount(data.recipes)
        setFavorites(data.favorites)
    }
    if (user == undefined || user == null) return null
    return (
        <>
            <EditProfile user={user} isModal isOpen={isOpen} onClose={onClose} />
            <Card border={"none"} w={grow ? "100%" : "md"}>
                <CardBody>
                    <Stack spacing="3">
                        <Flex direction={"column"}>
                            <Flex gap={10}>
                                <Box >
                                    <Avatar
                                        size="lg"
                                        name={user.name as string}
                                        src={user.image as string}
                                    />
                                </Box>
                                <Flex flexWrap="nowrap" gap={5} >
                                    <Flex gap={4} direction={"column"}>
                                        <Heading size="md">
                                            <Group noWrap>
                                                {isPopover ? <Link style={{ textDecoration: "underline" }} href={`/${user.name as string}`}>{user.name}</Link> : user.name}

                                                {isProfileUser ?
                                                    !isPopover ?
                                                        <ActionIcon onClick={onOpen}>
                                                            <IconEdit size={20} />
                                                        </ActionIcon>
                                                        : null
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
            </Card >
        </>
    )
}

export default UserCard
