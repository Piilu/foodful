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
} from "@chakra-ui/react";

const profile = () => {
  const router = useRouter();
  const name = router.query.name as string;
  const data = ["munad", "piim", "leib", "vorst", "juust"];
  return (
    <Container>
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem colSpan={3}>
          <UnorderedList>
            {data.map((item, index) => {
              return <ListItem key={index}>{item}</ListItem>;
            })}
          </UnorderedList>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stack mt="6" spacing="3">
                <Heading>
                  <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar
                        name={name}
                        src="https://www.recipefy.com/media/W1siZiIsIjIwMTQvMTEvMjUvMTVfMzhfNTFfODQzX21pbmEwMDA3X2pwZy5qcGciXSxbInAiLCJhdXRvX29yaWVudCJdLFsicCIsInRodW1iIiwiMTYweDE2MCMiXSxbImUiLCJqcGciXV0/mina0007-jpg.jpg"
                      />
                      <Box>
                        <Heading size="sm">{name}</Heading>
                      </Box>
                    </Flex>
                    <IconButton
                      variant="ghost"
                      colorScheme="gray"
                      aria-label="See menu"
                    />
                  </Flex>
                </Heading>
                <Text>
                  Siin on kokkuvõte minu elust, et kõik saaksid lugeda ja
                  imestada.
                </Text>
              </Stack>
            </CardBody>
            <Divider />
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
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default profile;
