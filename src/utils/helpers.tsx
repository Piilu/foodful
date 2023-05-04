import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";

export const requireAuth = async (ctx: GetServerSidePropsContext) =>
{
    const session = await getServerAuthSession(ctx);
    return {
        props: {
            session: session,
        },
    }
}