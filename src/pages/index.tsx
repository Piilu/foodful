import styles from "./index.module.css";
import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ExampleReqType, ExampleResType } from "./api/example";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { Box, Button, Container, Flex, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { requireAuth } from "~/utils/helpers";
import Recipe from "~/components/auth/Recipe";
import { Group, MediaQuery } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import RecipeList from "~/components/recipe/RecipeList";
import PopularRecipes from "~/components/custom/PopularRecipes";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx);
}

const Home: NextPage = () =>
{
  const { data: session } = useSession();
  return (
    <>
      {/* See saab eraldi komponent olla */}
      <Text align="center" pb={5} fontSize="4xl" > Todays hot recipes</Text>
      <Group style={{ justifyContent: "center" }}>
        <PopularRecipes />
      </Group>

      {/* See saab eraldi komponent olla */}
      <Box style={{ padding: "1em" }}>
        <Text align="center" pb={5} fontSize="4xl" >Search for recipes</Text>
        <RecipeList search limit={10} page={1} />
      </Box>

    </>
  );
};

export default Home;
