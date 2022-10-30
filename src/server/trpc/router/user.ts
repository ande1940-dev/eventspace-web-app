import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    // Queries 
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
                blockedList: true,
                notifications: true,
                receivedFriendRequests: true,
                sentFriendRequests: true
            }
        })
    }), 
    
    // Mutations 
    addToBlockList: protectedProcedure
    .input(z.object({ blockedUserId: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        ctx.prisma.user.update({
            where: {
                id: sessionUserId
            }, 
            data: {
                blockedList: {
                    connect: {
                        id: input.blockedUserId
                    }
                }
            }
        })
    }),
    addToFriendList: protectedProcedure
    .input(z.object({ friendUserId: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        ctx.prisma.user.update({
            where: {
                id: sessionUserId
            }, 
            data: {
                friends: {
                    connect: {
                        id: input.friendUserId
                    }
                }
            }
        })
    }),
    removeFromBlockList: protectedProcedure
    .input(z.object({blockedUserId: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        ctx.prisma.user.update({
            where: {
                id: sessionUserId
            }, 
            data: {
                blockedList: {
                    disconnect: {
                        id: input.blockedUserId
                    }
                }
            }
        })
    }),
    removeFromFriendList: protectedProcedure
    .input(z.object({friendUserId: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        ctx.prisma.user.update({
            where: {
                id: sessionUserId
            }, 
            data: {
                blockedList: {
                    disconnect: {
                        id: input.friendUserId
                    }
                }
            }
        })
    }),
});
