import { Card, CardBody, Stack, Box, Heading, Flex, Text, Avatar, Center, CardFooter, ButtonGroup, Button } from '@chakra-ui/react'
import { ActionIcon, Group } from '@mantine/core'
import { User } from '@prisma/client'
import { IconEdit } from '@tabler/icons-react'
import React, { FunctionComponent } from 'react'
import StatCard from './StatText'
import StatText from './StatText'
import PromoLink from './PromoLink'

type UserCardType = {
    user: User,
}

const UserCard: FunctionComponent<UserCardType> = (props) =>
{
    const { user } = props;
    return (
        <Card w={"md"}>
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
                                            <ActionIcon>
                                                <IconEdit size={20} />
                                            </ActionIcon>
                                        </Group>
                                    </Heading>
                                    <Group>
                                        <StatText label='Retsepti' value={10} />
                                        <StatText label='Lemmikut' value={10} />
                                        {user?.website != null ?
                                            <PromoLink link='https://mantine.dev/core/' />
                                            : null}
                                    </Group>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Text align={"center"}>
                        {user.bio}
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter>
                <ButtonGroup mx="auto" spacing="2">
                    <Button size="sm" colorScheme="green">
                        Retseptid
                    </Button>
                    <Button size="sm" colorScheme="green">
                        Lemmikud
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card >
    )
}

export default UserCard
