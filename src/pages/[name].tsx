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
import { IconPlus } from "@tabler/icons-react";
import CreateRecipe from "~/components/recipe/CreateRecipe";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx, ctx.query.name as string);
}

type ProfileType = {
  isProfileUser: boolean;
  profileUser: User;
  notFound?: boolean;
};

const profile: NextPage<ProfileType> = (props) =>
{
  const { isProfileUser, profileUser, notFound } = props;
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (notFound)
  {
    return (
      <Box  mx={"auto"}>
        <Heading as={"h4"} size="lg" mb={5}>User not found</Heading>
      </Box>
    );
  }
  return (
    <>
      <CreateRecipe isModal isOpen={isOpen} onClose={onClose} />
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Box mb={5}>
          <UserCard isProfileUser={isProfileUser} grow user={profileUser} />
          <Button mt={2} w={"100%"} colorScheme="green" onClick={onOpen} leftIcon={<IconPlus />}>Add new recipe</Button>
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
            {isProfileUser ?
              <Button mt={2} w={"100%"} colorScheme="green" onClick={onOpen} leftIcon={<IconPlus />}>Add new recipe</Button>
              : null}
          </Box>
        </MediaQuery>
      </Flex >

    </>
  );
};

export default profile;
