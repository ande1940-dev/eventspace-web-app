import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const invitationRouter = router({
   // Mutations 
   createInvitation: protectedProcedure
   .input(z.object({eventId: z.string().uuid(), userId: z.string().uuid()}))
   .mutation(async ({ctx, input}) => {
        const invitation = await ctx.prisma.invitation.create({
            data: {
                recipient: {
                    connect: {
                        id: input.userId
                    }
                },
                event: {
                    connect: {
                        id: input.eventId
                    }
                }
            }
        })
        
        return invitation
   }), 
   deleteInvitation: protectedProcedure
   .input(z.object({eventId: z.string().uuid(), recipientId: z.string().uuid()}))
   .mutation(({ ctx, input }) => {
        return ctx.prisma.invitation.delete({
            where: {
                eventId_recipientId: input
            }
        })
   })
});