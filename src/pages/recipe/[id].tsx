import { Card, Container, CardHeader, Box, Heading, Text, Image, CardBody, List, CardFooter, Button, Stack, StackDivider, AspectRatio, Divider, Tooltip, Flex, Switch, FormLabel, FormControl, ListItem, SimpleGrid } from '@chakra-ui/react';
import { ActionIcon, Group } from '@mantine/core';
import { Favorites, Instruction, Recipe, User, ingredients } from '@prisma/client';
import { IconClock, IconBook, IconBook2, IconLicense } from '@tabler/icons-react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import prettyMilliseconds from 'pretty-ms';
import React from 'react'
import Moment from 'react-moment';
import UserAvatar from '~/components/profile/UserAvatar';
import { requireAuth } from '~/utils/helpers';
export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx, undefined, true);
}

type RecipeType = {
  recipe: Recipe & {
    user: User;
    ingredients: ingredients[];
    Favorites: Favorites[];
    instructions: Instruction[];
  }
  isRecipeOwner: boolean;
}
export const RecipePage: NextPage<RecipeType> = (props) =>
{
  const { recipe, isRecipeOwner } = props;
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <Card minW={"md"} >
      <AspectRatio ratio={16 / 5}>
        <Image
          objectFit={"cover"}
          src='https://images.pexels.com/photos/6287527/pexels-photo-6287527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Chakra UI'
        />
      </AspectRatio>

      <CardBody>
        <CardHeader p={0} mb={5} >
          <Group position='apart'>
            <Heading size='lg'>{recipe.name}</Heading>
            <Group>
              <Tooltip label='Favorite'>
                <ActionIcon color={recipe.Favorites.some((favorite) => favorite.userId == session?.user.id) ? "orange" : "gray"}>
                  <IconLicense />
                </ActionIcon>
              </Tooltip>
              <Flex align={"center"}>
                <FormLabel fontSize={"sm"} htmlFor='edit-recipe' mb='0'>
                  Edit
                </FormLabel>
                <Switch colorScheme='green' size={"sm"} id='edit-recipe' />
              </Flex>
            </Group>
          </Group>
          <Group mt={5}>
            <UserAvatar showName size="sm" user={recipe?.user} />
            <Tooltip openDelay={500} placement='right' label={<Moment calendar>{recipe?.updatedAt}</Moment>}>
              <Text color='gray.500' fontSize='sm'>
                <Moment fromNow>{recipe?.updatedAt}</Moment>
              </Text>
            </Tooltip>
          </Group>
        </CardHeader>
        <Stack divider={<StackDivider />} spacing='4'>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              <Flex align={"center"} gap={2}>
                <IconBook2 />
                Overview
              </Flex>
            </Heading>
            <Text pt='2' fontSize='sm' wordBreak={"break-word"}>
              {recipe.description}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              <Flex align={"center"} gap={2}>
                <IconClock />
                Preparation time:
              </Flex>
            </Heading>
            <Text pt='2' fontSize='sm'>
              {prettyMilliseconds(recipe.totalTime * 60000)}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Ingredients:
            </Heading>
            <List>
              <SimpleGrid columns={[2, null, 3]} spacing={10}>

                {recipe?.ingredients?.length !== 0 ? recipe.ingredients.map((ingredient) =>
                {
                  return (
                    <ListItem key={`${ingredient.id}-recipe-ingridient`}>
                      <Text pt='2' fontSize='sm'>
                        {ingredient.name}
                      </Text>
                    </ListItem>
                  )
                }) : <Text pt='2' fontSize='sm'>No ingredients</Text>}
              </SimpleGrid>

            </List>

          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default RecipePage;