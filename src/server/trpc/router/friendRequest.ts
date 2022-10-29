import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const friendRequestRouter = router({
   createFriendRequest: protectedProcedure
   .input(z.object({recipientName: z.string(), recipientId: z.string().uuid()}))
   .query(({ctx, input}) => {
        const sessionUserId = ctx.session.user.id
        const sessionUserName = ctx.session.user.name
        if (sessionUserName !== null && sessionUserName !== undefined) {
            ctx.prisma.friendRequest.create({
                data: {
                    recipient: {
                        connect: {
                           id: input.recipientName
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
        }
   })
});
