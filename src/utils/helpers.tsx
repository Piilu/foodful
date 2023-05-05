import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export const requireAuth = async (ctx: GetServerSidePropsContext, name?: string) =>
{
    const session = await getServerAuthSession(ctx);
    if (name !== undefined)
    {
        const profileUser = await prisma.user.findFirst({
            where: {
                name: name,
            },
        })
        if (profileUser === null)
        {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false,
                },
            }
        }
        else
        {
            return {
                props: {
                    session: session,
                    profileUser: profileUser,
                    isProfileUser: session?.user?.id === profileUser.id,
                },
            }
        }
    }
    return {
        props: {
            session: session,
        },
    }
}