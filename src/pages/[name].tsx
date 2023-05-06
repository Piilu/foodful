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
  Center
} from "@chakra-ui/react";
import Recipe from "~/components/auth/Recipe";
import RecipeList from "~/components/recipe/RecipeList";
import { requireAuth } from "~/utils/helpers";
import { GetServerSidePropsContext, NextPage } from "next/types";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import UserCard from "~/components/profile/UserCard";
import { MediaQuery } from "@mantine/core";

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
    <Flex
      align="flex-start"
      justify="center"
      wrap="nowrap"
      gap={4}
    >
      <Box style={{ width: "100%" }} mx={"auto"}>
        <RecipeList showUpperPagination search limit={10} page={1} userId={profileUser.id} />
      </Box>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <div>
          <UserCard user={profileUser} />
        </div>
      </MediaQuery>
    </Flex>
  );
};

export default profile;
