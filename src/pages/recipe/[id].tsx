import { Card, Container, CardHeader, Box, Heading, Text, Image, CardBody, CardFooter, Button, Stack, StackDivider } from '@chakra-ui/react';
import { Favorites, Instruction, Recipe, User, ingredients } from '@prisma/client';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react'
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
}
export const recipe: NextPage<RecipeType> = (props) =>
{
  const { recipe } = props;
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <Card>
      <Image
        objectFit='cover'
        src='https://images.pexels.com/photos/6287527/pexels-photo-6287527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        alt='Chakra UI'
      />

      <CardBody>
        <Card>
          <CardHeader>
            <Heading size='md'>{recipe.name}</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Preparation time:
                </Heading>
                <Text pt='2' fontSize='sm'>
                  {recipe.totalTime} minutes
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Overview
                </Heading>
                <Text pt='2' fontSize='sm'>
                  {recipe.description}
                </Text>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Guidelines:
                </Heading>
                <Text pt='2' fontSize='sm'>
                  Boil water
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </CardBody>

      <CardFooter
        justify='space-between'
        flexWrap='wrap'
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Button flex='1' variant='ghost'>
          Like
        </Button>
      </CardFooter>
    </Card>
  )
}

export default recipe;