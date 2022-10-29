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
    getProfileById: publicProcedure
    .input(z.string().uuid())
    .query(({ctx, input}) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input 
            }
        })
    }),
    getDashboardById: protectedProcedure
    .input(z.string().uuid())
    .mutation(({ctx, input}) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input
            }, 
            include: {
                friends: true,
                sentFriendRequests: true,
                receivedFriendRequests: true
            }
        })
    }), 
    getSecretMessage: protectedProcedure.query(() => {
        return "You are logged in and can see this secret message!";
    }),
});
