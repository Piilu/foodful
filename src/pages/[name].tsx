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
  // const data = ["munad", "piim", "leib", "vorst", "juust"];
  return (
    <Flex
      direction={{
        base: "column",
        md: "row",
      }}
      align="flex-start"
      justify="center"
      wrap="nowrap"
      gap={4}
    >
      <Box style={{ width: "100%" }} mx={"auto"}>

        <RecipeList search limit={10} page={1} userId={profileUser.id} />
      </Box>

      <Box style={{ width: "40%" }} position="sticky" top="1rem">
        <Card>
          <CardBody>
            <Stack mt="6" spacing="3">
              <Heading>
                <Flex spacing="4">
                  <Flex flex="1" gap="3" alignItems="center" flexWrap="wrap">
                    <Avatar
                      name={profileUser.name}
                      src="https://www.recipefy.com/media/W1siZiIsIjIwMTQvMTEvMjUvMTVfMzhfNTFfODQzX21pbmEwMDA3X2pwZy5qcGciXSxbInAiLCJhdXRvX29yaWVudCJdLFsicCIsInRodW1iIiwiMTYweDE2MCMiXSxbImUiLCJqcGciXV0/mina0007-jpg.jpg"
                    />
                    <Box>
                      <Heading size="sm">{profileUser.name}</Heading>
                    </Box>
                  </Flex>
                </Flex>
              </Heading>
              <Text>
                Siin on kokkuvõte minu elust, et kõik saaksid lugeda ja
                imestada.
              </Text>
            </Stack>
          </CardBody>
          <Center>
            <CardFooter>
              <ButtonGroup spacing="2">
                <Stack>
                  <Button size="lg" colorScheme="green">
                    Retseptid
                  </Button>
                  <Button size="lg" colorScheme="green">
                    Lemmikud
                  </Button>
                </Stack>
              </ButtonGroup>
            </CardFooter>
          </Center>
        </Card>
      </Box>
    </Flex>
  );
};

export default profile;
