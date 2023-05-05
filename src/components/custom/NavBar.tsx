import React, { FunctionComponent, ReactNode } from 'react'
import { Brands, LinkType } from '~/constants/types';
import
{
  Avatar,
  Image,
  Box,
  Button,
  Tooltip,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { IconMenu, IconMenu2, IconX, IconLogout, IconLogin, IconStarFilled, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import NavLink from './NavLink';
import { ActionIcon, MediaQuery } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import UserMenuButton from './UserMenuButton';
const Links: LinkType[] = [{ label: 'My recipes', link: "", isProfile: true }];

const NavBar = () =>
{
  const { data: session } = useSession();
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} mb={10} px={50}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {session ?
          <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
            <ActionIcon onClick={isOpen ? onClose : onOpen}>
              {isOpen ? (<IconX />) : (<IconMenu2 />)}
            </ActionIcon>
          </MediaQuery>
          : null}
        <HStack spacing={8} alignItems={'center'}>
          <Link href="/">
            <Box>
              <Image
                w={120}
                src='/foodful.png'
              />
            </Box>
          </Link>
          {session ?
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((item) => (
                <NavLink key={item.link} item={item} />
              ))}
            </HStack>
            : null}
        </HStack>
        <Flex alignItems={'center'}>
          {session ?

            <Menu>
              <UserMenuButton />
              <MenuList>
                <MenuItem icon={<IconSettings />}>Settings</MenuItem>
                <MenuItem icon={<IconStarFilled />}>Favorites</MenuItem>
                <MenuDivider />
                <MenuItem icon={<IconLogout />} onClick={() => signOut()}> Logout</MenuItem>
              </MenuList>
            </Menu>

            : <Button size="md" colorScheme='green' onClick={() => signIn()}>Login</Button>}
        </Flex>
      </Flex>

      {isOpen ? session ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((item) => (
              <NavLink key={item.link} item={item} />
            ))}
          </Stack>
        </Box>
      ) : null : null}
    </Box>
  )
}
export default NavBar;
