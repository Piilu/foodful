import { Link as StyeLink, useColorModeValue } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { type FunctionComponent } from 'react'
import { type LinkType } from '~/constants/types';
import Link from 'next/link';


type NavLinkType = {
    item: LinkType;
}
const NavLink: FunctionComponent<NavLinkType> = (props) =>
{
    const { data: session } = useSession();
    const { item } = props;
    const router = useRouter();
    const activeColor = useColorModeValue('gray.200', 'gray.700');
    const link = item.isProfile ? `${session?.user.name as string}` : item.link;

    return (
        <StyeLink
            as={Link}
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: activeColor,
            }}
            bg={router.query?.name?.toLocaleLowerCase() === link.toLocaleLowerCase() ? activeColor : null}
            href={link}>
            {item.label}
        </StyeLink>
    )
}

export default NavLink
