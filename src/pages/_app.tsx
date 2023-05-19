import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'

import "~/styles/globals.css";
import NavBar from "~/components/custom/NavBar";
import { Container } from "@mantine/core";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) =>
{
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <NavBar />
        <Head><link rel="shortcut icon" href="/fooful_favicon.png"></link></Head>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default MyApp;
