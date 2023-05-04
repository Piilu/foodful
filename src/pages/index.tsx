import styles from "./index.module.css";
import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ExampleReqType, ExampleResType } from "./api/example";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { Button, Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { authOptions, getServerAuthSession } from "~/server/auth";
import { requireAuth } from "~/utils/helpers";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  const session = await getServerAuthSession(ctx)
  return await requireAuth(ctx);
}

const Home: NextPage = () =>
{
  const { data: session } = useSession();
  return (
    <div>
      <p>Current user: {session?.user.name}</p>
    </div>
  );
};

export default Home;
