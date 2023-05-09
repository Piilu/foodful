import { Card, Container, CardHeader, Box, Heading, Text, Image, CardBody, List, CardFooter, Button, Stack, StackDivider, AspectRatio, Divider, Tooltip, Flex, Switch, FormLabel, FormControl, ListItem, SimpleGrid, TableContainer, Table, Thead, Tr, Th, Tbody, Td, background, OrderedList, useDisclosure } from '@chakra-ui/react';
import { ActionIcon, Group } from '@mantine/core';
import { Favorites, Instruction, Recipe, User, ingredients } from '@prisma/client';
import { IconClock, IconBook, IconBook2, IconLicense, IconEdit } from '@tabler/icons-react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import prettyMilliseconds from 'pretty-ms';
import React, { use } from 'react'
import Moment from 'react-moment';
import UserAvatar from '~/components/profile/UserAvatar';
import CreateRecipe from '~/components/recipe/CreateRecipe';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Card mb={10} >
      {isOpen ?
        <CreateRecipe onClose={onClose} isOpen={isOpen} recipeId={recipe.id} currentRecipe={recipe} isModal />
        : null}
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
              <Tooltip openDelay={500} label='Favorite'>
                <ActionIcon color={recipe.Favorites.some((favorite) => favorite.userId == session?.user.id) ? "orange" : "gray"}>
                  <IconLicense />
                </ActionIcon>
              </Tooltip>
              {isRecipeOwner ?
                <Flex align={"center"}>
                  <Tooltip openDelay={500} label="Edit">
                    <ActionIcon onClick={onOpen} >
                      <IconEdit />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
                : null}
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
                Total Time:
              </Flex>
            </Heading>
            <Text pt='2' fontSize='sm'>
              {prettyMilliseconds(recipe.totalTime * 60000)}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Ingredients ({recipe.ingredients.length}):
            </Heading>
            <TableContainer shadow={"md"} mt={3} >
              <Table variant="simple" colorScheme="whiteAlpha" size='sm'>

                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th >Amount</Th>
                    <Th isNumeric title='Some information about that ingredient'>Infromation</Th>
                  </Tr>
                </Thead>
                <Tbody>

                  {recipe?.ingredients?.length !== 0 ? recipe.ingredients.map((ingredient, index) =>
                  {
                    return (
                      <Tr opacity={0.5} key={`${index}-ingredients-${ingredient.id}`} _hover={{
                        opacity: 1,
                      }}>
                        <Td>{ingredient.name}</Td>
                        <Td > {ingredient.amount}</Td>
                        <Td isNumeric >{ingredient.description}</Td>
                      </Tr>
                    )
                  }) : <Text pt='2' fontSize='sm'>No ingredients</Text>}
                </Tbody>

              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Instructions ({recipe?.instructions?.length}):
            </Heading>
            <OrderedList mt={3} spacing={3}>
              {recipe?.instructions?.length !== 0 ? recipe.instructions.map((instruction, index) =>
              {
                return (
                  <>
                    <ListItem key={`${index}-instruction-${instruction.id}`}>
                      {instruction?.step}
                    </ListItem>
                  </>
                );
              }) : <Text pt='2' fontSize='sm'>No instructions</Text>}
            </OrderedList>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default RecipePage;