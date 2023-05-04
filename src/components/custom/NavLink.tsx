import { Link, useColorModeValue } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

const NavLink = ({ children }: { children: ReactNode }) =>
{
    return (
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            href={'#'}>
            {children}
        </Link>
    )
}

export default NavLink
