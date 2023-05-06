import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, ThemeConfig } from '@chakra-ui/react'

import "~/styles/globals.css";
import NavBar from "~/components/custom/NavBar";
import { Container, Modal } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { extendTheme } from "@chakra-ui/react"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) =>
{
  const configChakra: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: "dark",
  };

  const theme = extendTheme(configChakra);

  return (
    <ChakraProvider theme={theme} >
      <ModalsProvider>
        <SessionProvider session={session}>
          <NavBar />
          <Container size={"xl"} >
            <Component {...pageProps} />
          </Container>
        </SessionProvider>
      </ModalsProvider>

    </ChakraProvider>

  );
};

export default MyApp;
