import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ExampleReqType, ExampleResType } from "./api/example";
import axios from "axios";
import { EndPoint } from "~/constants/EndPoints";
import { Button, Container } from "@chakra-ui/react";

const Home: NextPage = () =>
{
  const exampleBackend = async () =>
  {
    const data: ExampleReqType = {
      name: "Test"
    }
    await axios.post(`${window.origin}${EndPoint.EXAMPLE}`).then(res =>
    {
      const newData = res.data as ExampleResType;
      if (newData.success)
      {
        alert("Success")
      }
      else
      {
        alert("Failed")
      }
    }).catch(err =>
    {
      alert("Failed server error")
    })
  }

  return (
    <div>
      <Button onClick={exampleBackend}>test</Button>
    </div>
  );
};

export default Home;
