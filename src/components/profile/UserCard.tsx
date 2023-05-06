import { Card, CardBody, Stack, Box, Heading, Flex, Text, Avatar, Center, CardFooter, ButtonGroup, Button } from '@chakra-ui/react'
import { User } from '@prisma/client'
import React, { FunctionComponent } from 'react'

type UserCardType = {
    user: User,
}

const UserCard: FunctionComponent<UserCardType> = (props) =>
{
    const { user } = props;
    return (
        <Card>
            <CardBody>
                <Stack mt="6" spacing="3">
                    <Heading>
                        <Flex spacing="4">
                            <Flex flex="1" gap="3" alignItems="center" flexWrap="wrap">
                                <Avatar
                                    name={user.name}
                                    src="https://www.recipefy.com/media/W1siZiIsIjIwMTQvMTEvMjUvMTVfMzhfNTFfODQzX21pbmEwMDA3X2pwZy5qcGciXSxbInAiLCJhdXRvX29yaWVudCJdLFsicCIsInRodW1iIiwiMTYweDE2MCMiXSxbImUiLCJqcGciXV0/mina0007-jpg.jpg"
                                />
                                <Box>
                                    <Heading size="sm">{user.name}</Heading>
                                </Box>
                            </Flex>
                        </Flex>
                    </Heading>
                    <Text>
                        Siin on kokkuvõte minu elust, et kõik saaksid lugeda ja
                        imestada.
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
