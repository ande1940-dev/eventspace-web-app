import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const notificationRouter = router({
   //Queries
   getNotificationsByUser: protectedProcedure
   .query(({ctx}) => {
        return ctx.prisma.notification.findMany({
            where: {
                recipientId: ctx.session.user.id
            }
        })
   }),

   //Mutation 
   createFriendRequestNotification: protectedProcedure
   .input(z.object({ 
        body: z.string(),
        redirect: z.string(),
        recipientId: z.string().uuid()
    }))
    .mutation(async ({ctx, input}) => {
        const notification = await ctx.prisma.notification.create({
            data: {
                friendRequest: {
                    connect: {
                        recipientId_senderId: {recipientId: input.recipientId, senderId: ctx.session.user.id}
                    }
                },
                body: input.body,
                recipient: {
                    connect: {
                        id: input.recipientId
                    }
                },
                redirect: input.redirect            
            }
        })

        return notification 
    }),
   createFriendshipNotification: protectedProcedure
   .input(z.object({ 
        body: z.string(),
        redirect: z.string(),
        recipientId: z.string().uuid()
    }))
    .mutation(async ({ctx, input}) => {
        const notification = await ctx.prisma.notification.create({
            data: {
                friendship: {
                    connect: {
                        acceptedById_initiatedById: {acceptedById: ctx.session.user.id, initiatedById: input.recipientId}
                    }
                },
                body: input.body,
                recipient: {
                    connect: {
                        id: input.recipientId
                    }
                },
                redirect: input.redirect            
            }
        })

        return notification 
    }),
    deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.string().uuid()}))
    .mutation(async ({ ctx, input }) => {
        const notification = await ctx.prisma.notification.delete({
            where: {
                id: input.notificationId
            }
        })
        return notification
    })
});
