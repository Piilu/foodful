import { useRouter } from "next/router";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Flex,
  Avatar,
  Box,
  IconButton,
  WrapItem,
  Center
} from "@chakra-ui/react";
import Recipe from "~/components/auth/Recipe";

const profile = () => {
  const router = useRouter();
  const name = router.query.name as string;
  // const data = ["munad", "piim", "leib", "vorst", "juust"];
  return (
    <Container maxW='2xl' centerContent>
      <Grid
        w="1200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem colSpan={4}>
          <Heading><Center>{name}&rsquo;s recipes</Center></Heading>
          {/* <UnorderedList>
            {data.map((item, index) => {
              return <ListItem key={index}>{item}</ListItem>;
            })}
          </UnorderedList> */}
          <UnorderedList mt="6">            
          <Recipe name="Test" horizontal guidelines="Testing guidlines" info="Info jeje" />          
          <Recipe name="Test" horizontal guidelines="Testing guidlines" info="Info jeje" />
          <Recipe name="Test" horizontal guidelines="Testing guidlines" info="Info jeje" />
          <Recipe name="Test" horizontal guidelines="Testing guidlines" info="Info jeje" />
          <Recipe name="Test" horizontal guidelines="Testing guidlines" info="Info jeje" />
          </UnorderedList>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stack mt="6" spacing="3">
                <Heading>
                  <Flex spacing="4">
                    <Flex flex="1" gap="3" alignItems="center" flexWrap="wrap">
                      <Avatar
                        name={name}
                        src="https://www.recipefy.com/media/W1siZiIsIjIwMTQvMTEvMjUvMTVfMzhfNTFfODQzX21pbmEwMDA3X2pwZy5qcGciXSxbInAiLCJhdXRvX29yaWVudCJdLFsicCIsInRodW1iIiwiMTYweDE2MCMiXSxbImUiLCJqcGciXV0/mina0007-jpg.jpg"
                      />
                      <Box>
                        <Heading size="sm">{name}</Heading>
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
        </GridItem>
      </Grid>
    </Container>
  );
};

export default profile;
