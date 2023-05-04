import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { getServerAuthSession } from "~/server/auth";

export const requireAuth = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, cb: any) =>
{
    const session = await getServerAuthSession(ctx);
    return cb({ session });
}