import { useRouter } from "next/router";
import React from "react";
import
{
  Card,
  CardBody,
  CardFooter,
  Container,
  Stack,
  Heading,
  Text,
  ButtonGroup,
  Button,
  UnorderedList,
  Grid,
  GridItem,
  Flex,
  Avatar,
  Box,
  Center,
  useDisclosure,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Tabs,
} from "@chakra-ui/react";
import Recipe from "~/components/auth/Recipe";
import RecipeList from "~/components/recipe/RecipeList";
import { requireAuth } from "~/utils/helpers";
import { GetServerSidePropsContext, NextPage } from "next/types";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import UserCard from "~/components/profile/UserCard";
import { MediaQuery } from "@mantine/core";
import EditProfile from "~/components/profile/EditProfile";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx, ctx.query.name as string);
}

type ProfileType = {
  isProfileUser: boolean;
  profileUser: User;
};

const profile: NextPage<ProfileType> = (props) =>
{
  const { isProfileUser, profileUser } = props;
  const { data: session } = useSession();
  return (
    <>

      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Box mb={5}>
          <UserCard isProfileUser={isProfileUser} grow user={profileUser} />
        </Box>
      </MediaQuery>
      <Flex
        align="flex-start"
        justify="center"
        wrap="nowrap"
        gap={4}
      >

        <Box style={{ width: "100%" }} mx={"auto"}>
          <Heading as={"h4"} size="lg" mb={5}>{profileUser.name}'s recipes</Heading>
          <RecipeList showFavorites showUpperPagination search limit={10} page={1} userId={profileUser.id} />
        </Box>

        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Box position="sticky" top="1rem">
            <UserCard isProfileUser={isProfileUser} user={profileUser} />
          </Box>
        </MediaQuery>
      </Flex >

    </>
  );
};

export default profile;
