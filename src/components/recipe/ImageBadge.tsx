import { Badge, IconButton } from '@chakra-ui/react'
import { Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React, { type FunctionComponent } from 'react'

type ImageBadgeType = {
    imageUrl: string;
    imageName: string;
    resetFiles: () => void;
}
const ImageBadge: FunctionComponent<ImageBadgeType> = (props) =>
{
    const { imageName, resetFiles } = props
    return (
        <Badge p={2} my={3} colorScheme='green' borderRadius={10}>
            <Group >
                {imageName}
                <IconButton
                    onClick={resetFiles}
                    aria-label='Call Segun'
                    size='xs'
                    icon={<IconX />
                    }
                />
            </Group>
        </Badge>
    )
}

export default ImageBadge
