import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const friendRequestRouter = router({
   createFriendRequest: protectedProcedure
   .input(z.object({recipientId: z.string().uuid(), recipientName: z.string()}))
   .mutation(async ({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        const sessionUserName = ctx.session.user.name
        if (sessionUserName !== null && sessionUserName !== undefined) {
            const friendRequest = await ctx.prisma.friendRequest.create({
                data: {
                    recipient: {
                        connect: {
                           id: input.recipientId
                        }
                    }, 
                    recipientName: input.recipientName,
                    sender: {
                        connect: {
                            id: sessionUserId
                        }
                    },
                    senderName: sessionUserName
                }
            })
            return friendRequest
        }
   })
});
