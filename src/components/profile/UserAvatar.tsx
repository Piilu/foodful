import { Avatar, Popover, PopoverTrigger, PopoverBody, PopoverFooter, PopoverHeader, PopoverContent, PopoverArrow, PopoverCloseButton, Button, ButtonGroup, Box, Text, Flex } from '@chakra-ui/react'
import { Group, Portal } from '@mantine/core'
import { User } from 'next-auth'
import React, { FunctionComponent } from 'react'
import UserCard from './UserCard'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type UserAvatarProps = {
    user: User,
    size?: | "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | "full";
    showName?: boolean,
}
const UserAvatar: FunctionComponent<UserAvatarProps> = (props) =>
{
    const { user, size, showName } = props
    const initialFocusRef = React.useRef()
    const { data: session } = useSession()
    return (

        <Popover
            initialFocusRef={initialFocusRef}
            closeOnBlur={true}
            openDelay={200}
            trigger='hover'
        >
            <PopoverTrigger>
                <Flex gap={2} align={"center"}>
                    <Avatar src={user?.image} name={user?.name} size={size} />
                    {showName ?
                        <Link style={{ textDecoration: "underline" }} href={`/${user.name}`}>{user.name}</Link>
                        : null}
                </Flex>
            </PopoverTrigger>
            <Portal>
                <PopoverContent w={"100%"}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <UserCard isPopover user={user} isProfileUser={session?.user.id == user.id} />
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

export default UserAvatar
