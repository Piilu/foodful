import { type GetServerSidePropsContext, type NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { requireAuth } from "~/utils/helpers";
import { Group } from "@mantine/core"
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
        <RecipeList orderCreatedAt="desc" search limit={10} page={1} />
      </Box>

    </>
  );
};

export default Home;
