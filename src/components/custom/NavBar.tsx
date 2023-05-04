import React, { FunctionComponent, ReactNode } from 'react'
import { Brands } from '~/constants/types';
import Image from 'next/image';
import
{
  Avatar,
  Box,
  Button,
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
import { IconMenu, IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import NavLink from './NavLink';
import { ActionIcon, MediaQuery } from '@mantine/core';
const Links = ['Midagi siia', 'Midagi siia 2', 'Midagi siia 3'];

const NavBar = () =>
{
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={50}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
          <ActionIcon onClick={isOpen ? onClose : onOpen}>
            {isOpen ? (<IconX />) : (<IconMenu2 />)}
          </ActionIcon>

        </MediaQuery>
        <HStack spacing={8} alignItems={'center'}>
          <Box>Logo</Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              <Avatar
                size={'sm'}
                src={
                  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                }
              />
            </MenuButton>
            <MenuList>
              <MenuItem>Link 1</MenuItem>
              <MenuItem>Link 2</MenuItem>
              <MenuDivider />
              <MenuItem>Link 3</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
export default NavBar;
