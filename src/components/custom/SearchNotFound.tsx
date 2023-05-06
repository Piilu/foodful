import React, { FunctionComponent } from 'react'
import { Group, Text } from '@mantine/core'
import { IconLicenseOff, IconSearchOff } from '@tabler/icons-react'

type SearchNotFoundType = {
    value: string
}
const SearchNotFound: FunctionComponent<SearchNotFoundType> = (props) =>
{
    const { value } = props;
    return (
        <>
            <Group position='center'>

                <IconLicenseOff size={50} color="gray" />
                <Text size={"lg"} align='center' c="dimmed">
                    {value}
                </Text>
            </Group>
        </>
    )
}

export default SearchNotFound
