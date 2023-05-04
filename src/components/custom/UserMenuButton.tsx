import { Avatar, Button, MenuButton, Text, useColorModeValue } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { Group } from "@mantine/core";
import React from 'react'

const UserMenuButton = () =>
{
    const { data: session } = useSession();
    return (
        <MenuButton
            as={Button}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            rounded={'md'}
            cursor={'pointer'}
            minW={0}>
            <Group>
                <Avatar
                    size={'sm'}
                    name={session?.user?.name}
                    src={
                        session?.user?.image
                    }
                />
                <Text>{session?.user?.name}</Text>
            </Group>
        </MenuButton>
    )
}

export default UserMenuButton
