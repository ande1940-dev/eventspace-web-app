import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    blockUser: protectedProcedure
    .input(z.object({ blockedUserId: z.string().uuid(), blockedUserName: z.string()}))
    .mutation(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        ctx.prisma.user.update({
            where: {
                id: sessionUserId
            }, 
            data: {
                blocked: {
                    connect: {
                        id: input.blockedUserId
                    }
                }
            }
        })
    }), 
    getAllUsers: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            where: {
                NOT: {
                    id: ctx.session?.user?.id
                }
            }
        });
    }),
    getUserById: protectedProcedure
    .input(z.string().uuid())
    .query(({ctx, input}) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input
            }, 
            include: {
                friends: true,
                sentFriendRequests: true,
                receivedFriendRequests: true,
                blockedList: true
            }
        })
    }), 
    getSecretMessage: protectedProcedure.query(() => {
        return "You are logged in and can see this secret message!";
    }),
});
