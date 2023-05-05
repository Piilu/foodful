import React, { FunctionComponent } from 'react';
import { Card, CardBody, CardFooter, Button, Heading, Stack, Image, Text, Flex, Box, Icon, Avatar, IconButton } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { IconClock, IconDotsVertical, IconLicense, IconMessage } from '@tabler/icons-react';

type Ingredient = {
    name: string,
    amount: string
}

type RecipeProps = {
    name: string,
    info: string,
    ingredients?: Ingredient[],
    guidelines: string
    horizontal?: boolean,
    userId: string,

}

const Recipe: FunctionComponent<RecipeProps> = (props) => 
{
    const { name, ingredients, guidelines, info, horizontal, userId } = props;
    const { data: session } = useSession();
    const isOwner = session?.user?.id == userId;

    if (horizontal)
    {
        return (
            <Card
                mb={5}
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                    alt='Caffe Latte'
                />

                <Stack>
                    <CardBody>
                        <Heading size='md'>{name}</Heading>
                        <Text py='2'>
                            {info}
                        </Text>
                    </CardBody>
                </Stack>
            </Card>
        )
    }
    else
    {

        return (
            <Card w={250} maxW="xs">
                <CardBody>
                    <Image
                        src='https://images.pexels.com/photos/262905/pexels-photo-262905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='2'>
                        <Flex flex='1' gap='2' alignItems='center' flexWrap='wrap'>
                            <Icon boxSize={7} as={IconClock} color='green' />
                            <Text>60 min</Text>
                        </Flex>
                        <Heading size='md'>{name}</Heading>
                        <Text>
                            {info}
                        </Text>
                        <Text>
                            {guidelines}
                        </Text>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <Button flex='2' variant='ghost' leftIcon={<IconLicense />}>
                        Yum!
                    </Button>
                    <Button flex='2' variant='ghost' leftIcon={<IconMessage />}>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

}

export default Recipe;