import { Button, Box, Card, CardHeader, Heading, CardBody, Stack, FormControl, FormLabel, Input, Textarea, ButtonGroup, InputGroup, IconButton } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import React from 'react'


export const newRecipe = () => {
  return (
    <Box as="form" p={8} borderRadius="lg" boxShadow="base" maxWidth="500px" mx="auto">
            <Heading size='md'>Add new Recipe</Heading>

            <Stack spacing='4'>
                    <FormControl isRequired>
                        <FormLabel>Recipe Name</FormLabel>
                        <Input type='name'/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder='Mexican dish' />
                    </FormControl>

                    <FormLabel>Ingredients</FormLabel>
                    <InputGroup>
                        <Input type='ingredients' placeholder='Eggs, Bacon, Sauce'/>
                        <IconButton aria-label='Add to friends' icon={<IconPlus />} />
                    </InputGroup>

                    <FormControl isRequired>
                        <FormLabel>Instructions</FormLabel>
                        <Textarea placeholder='Boil eggs' />
                    </FormControl>
            </Stack>
        <Button size="md" colorScheme='green'>Save</Button>
    </Box>
  )
}

export default newRecipe;