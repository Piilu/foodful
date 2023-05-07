import { GetServerSidePropsContext } from "next";
import { parse } from "path";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

export const requireAuth = async (ctx: GetServerSidePropsContext, name?: string, loadRecipe?: boolean) =>
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
                props: {
                    session: session,
                    notFound: true,
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

    if (loadRecipe)
    {
        if (isNaN(ctx.query.id))
        {
            return {
                redirect: {
                    destination: "/404/asd",
                    permanent: false,
                },
            }
        }

        const id = parseInt(ctx.query.id as string);

        const recipe = await prisma.recipe.findUnique({
            include: {
                ingredients: true,
                instructions: true,
                user: true,
                Favorites: true,
            },
            where: {
                id: id,
            }
        })

        if (recipe === null)
        {
            return {
                redirect: {
                    destination: "/404/asd",
                    permanent: false,
                },
            }
        }
        else
        {
            return {
                props: {
                    session: session,
                    recipe: recipe,
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
