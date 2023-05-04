import { Link, useColorModeValue } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { FunctionComponent, ReactNode } from 'react'
import { LinkType } from '~/constants/types';

type NavLinkType = {
    item: LinkType;
}
const NavLink: FunctionComponent<NavLinkType> = (props) =>
{
    const { data: session } = useSession();
    const { item } = props;
    const router = useRouter();
    const activeColor = useColorModeValue('gray.200', 'gray.700');
    const link = item.isProfile ? `/${session?.user.name as string}` : item.link;

    return (
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: activeColor,
            }}
            bg={router.asPath.toLocaleLowerCase() === link.toLocaleLowerCase() ? activeColor : null}
            href={link}>
            {item.label}
        </Link>
    )
}

export default NavLink
