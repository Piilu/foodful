import React, { FunctionComponent } from 'react';
import { Card, CardBody, Heading, Stack, Image, Text } from '@chakra-ui/react';

type Ingredient = {
    name: string,
    amount: string
}

type RecipeProps = {
    name: string,
    info:string,
    ingredients?: Ingredient[],
    guidelines: string

}

const Recipe: FunctionComponent<RecipeProps> = (props) => 
{
    const { name, ingredients,  guidelines, info } = props;
    return (
        <div>
            <Card maxW='sm'>
                <CardBody>
                    <Image
                    src='https://images.pexels.com/photos/262905/pexels-photo-262905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                    <Heading size='md'>{ name }</Heading>
                    <Text>
                        {info}
                    </Text>
                    <Text>
                        {guidelines}
                    </Text>
                    </Stack>
                </CardBody>
            </Card>
        </div>
    )
}

export default Recipe;