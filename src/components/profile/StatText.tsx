import React, { type FunctionComponent } from 'react'
import { Text } from '@mantine/core';
import { Flex } from '@chakra-ui/react';

type StatTextType = {
    value?: number,
    label: string,
}
const StatText: FunctionComponent<StatTextType> = (props) =>
{
    const { value, label } = props;
    return (
        <Flex gap={1} style={{ textAlign: "center" }}>
            <Text ta="center" fz="sm" fw={500}>
                {value != undefined ? value : "-"}
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
                {label}
            </Text>

        </Flex>
    )
}

export default StatText
