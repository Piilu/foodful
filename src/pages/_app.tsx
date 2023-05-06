import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'

import "~/styles/globals.css";
import NavBar from "~/components/custom/NavBar";
import { Container } from "@mantine/core";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) =>
{
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <NavBar />
        <Container size={"xl"}>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default MyApp;
