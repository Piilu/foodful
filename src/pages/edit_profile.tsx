import { Button, useDisclosure } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import EditProfile from "~/components/profile/EditProfile";
import CreateRecipe from "~/components/recipe/CreateRecipe";
import CreateRecipeModal from "~/components/recipe/CreateRecipeModal";
import { requireAuth } from "~/utils/helpers";
import { getUser } from "~/utils/queries/get-user";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx);
}

const edit_profile = () =>
{
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() =>
  {
    getUserData();
  }, [])

  const getUserData = async () =>
  {
    setUser(await getUser(session?.user?.id as string) as User);

  }

  return (
    <>
      <Button onClick={onOpen}></Button>
      <CreateRecipe isOpen={isOpen} isModal onOpen={onOpen} onClose={onClose} />
      <EditProfile user={user as User} />
    </>
  );
};

export default edit_profile;