import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const notificationRouter = router({
   createNotification: protectedProcedure
   .input(z.object({ recipientId: z.string().uuid(), friendRequestId: z.string().uuid().optional(), message: z.string()}))
   .mutation(async ({ctx, input}) => {
        const notification = await ctx.prisma.notification.create({
            data: {
                recipient: {
                    connect: {
                        id: input.recipientId
                    }
                },
                friendRequest: {
                    connect: {
                        id: input.friendRequestId
                    }
                }, 
                message : input.message
                
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
