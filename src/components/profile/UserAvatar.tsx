import { Avatar, Popover, PopoverTrigger, PopoverBody, PopoverFooter, PopoverHeader, PopoverContent, PopoverArrow, PopoverCloseButton, Button, ButtonGroup, Box, Text, Flex } from '@chakra-ui/react'
import { Group, Portal } from '@mantine/core'
import { User } from 'next-auth'
import React, { FunctionComponent, useEffect } from 'react'
import UserCard from './UserCard'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { User as PrismaUser } from '@prisma/client'


type UserAvatarProps = {
    user: User | undefined,
    size?: | "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | "full";
    showName?: boolean,
}
const UserAvatar: FunctionComponent<UserAvatarProps> = (props) =>
{
    const { user, size, showName } = props
    const initialFocusRef = React.useRef<any>()
    const { data: session } = useSession()
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
   
    if (user == undefined) return null

    return (

        <Popover
            initialFocusRef={initialFocusRef}
            closeOnBlur={true}
            openDelay={200}
            trigger='hover'
            isOpen={isPopoverOpen}
            onOpen={() => setIsPopoverOpen(true)}
            onClose={() => setIsPopoverOpen(false)}
        >
            <PopoverTrigger>
                <Flex gap={2} align={"center"}>
                    <Avatar src={user.image as string} name={user.name as string} size={size} />
                    {showName ?
                        <Link style={{ textDecoration: "underline" }} href={`/${user.name as string}`}>{user.name}</Link>
                        : null}
                </Flex>
            </PopoverTrigger>
            <Portal>
                <PopoverContent w={"100%"}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    {isPopoverOpen ? <UserCard user={user as PrismaUser} isProfileUser={session?.user.id == user.id} /> : null}
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

export default UserAvatar
