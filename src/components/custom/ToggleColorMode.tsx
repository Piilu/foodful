import { IconButton, useColorMode } from '@chakra-ui/react'
import { IconSun, IconMoonStars } from '@tabler/icons-react'
import React from 'react'

const ToggleColorMode = () =>
{
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <IconButton onClick={toggleColorMode} icon={isDark ? <IconSun color='yellow' size={18} /> : <IconMoonStars  size={18} />} aria-label={'toggle-theme'}></IconButton>
    )
}

export default ToggleColorMode
