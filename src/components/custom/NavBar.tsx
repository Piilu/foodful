import React, { } from 'react'
import { type LinkType } from '~/constants/types';
import
{
  Image,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { IconMenu2, IconX, IconLogout, IconLicense, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import NavLink from './NavLink';
import { ActionIcon, MediaQuery, Container } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import UserMenuButton from './UserMenuButton';
import ToggleColorMode from './ToggleColorMode';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/router';
const Links: LinkType[] = [{ label: 'My recipes', link: "", isProfile: true }];

const NavBar = () =>
{
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const handleSignOut = () =>
  {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: (
        <Text size="sm">
          Are you sure you want to sign out?
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: () => signOut(),
    });
  }
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} mb={5} >
      <Container size={"xl"}>
        {/* <EditProfile isModal  /> */}
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
          <Flex gap={2} alignItems={'center'}>
            <ToggleColorMode />
            {session ?

              <Menu>
                <UserMenuButton />
                <MenuList>
                  <MenuItem icon={<IconLogout />} onClick={() => handleSignOut()}> Logout</MenuItem>
                </MenuList>
              </Menu>

              : <Button size="md" colorScheme='green' size={"md"} leftIcon={<IconBrandGoogle />} onClick={(e) => { e.preventDefault(); void signIn("google") }}>Login</Button>}
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
      </Container>
    </Box >
  )
}
export default NavBar;
