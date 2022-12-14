import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const friendRequestRouter = router({
   // Mutations 
   createFriendRequest: protectedProcedure
   .input(z.object({recipientId: z.string().uuid()}))
   .mutation(({ctx, input}) => {
        return ctx.prisma.friendRequest.create({
            data: {
                recipient: {
                    connect: {
                        id: input.recipientId
                    }
                }, 
                sender: {
                    connect: {
                        id: ctx.session.user.id
                    }
                },
            }
        })
   }), 
   deleteFriendRequest: protectedProcedure
   .input(z.object({recipientId: z.string().uuid(), senderId: z.string().uuid()}))
   .mutation(({ ctx, input }) => {
        return ctx.prisma.friendRequest.delete({
            where: {
                recipientId_senderId: input
            }
        })
   })
});
