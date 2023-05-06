import { Flex } from '@chakra-ui/react'
import { ActionIcon } from '@mantine/core'
import { IconWorld } from '@tabler/icons-react'
import { Text } from '@mantine/core'
import React, { FunctionComponent } from 'react'
type PromoLinkType = {
    link: string | null,
}
const PromoLink: FunctionComponent<PromoLinkType> = (props) =>
{
    const { link } = props;
    if(link === null) return null;
    if (link.trim().length !== 0)
    {
        return (
            <ActionIcon component="a" href={link} target="_blank">
                <IconWorld />
            </ActionIcon>
        )
    }
    return null;
}

export default PromoLink
