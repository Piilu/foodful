import React, { FunctionComponent } from 'react'
import ToggleColorMode from '../custom/ToggleColorMode';
import { Group, Text } from '@mantine/core';
import { Card, Flex } from '@chakra-ui/react';

type StatTextType = {
    value?: number,
    label: string,
}
const StatText: FunctionComponent<StatCardType> = (props) =>
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
