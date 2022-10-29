import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    getAllUsers: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            where: {
                NOT: {
                    id: ctx.session?.user?.id
                }
            }
        });
    }),
    getUserById: publicProcedure
    .input(z.string().uuid())
    .query(({ctx, input}) => {
        return ctx.prisma.user.findUnique({where: {
            id: input 
        }})
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "You are logged in and can see this secret message!";
    }),
});
