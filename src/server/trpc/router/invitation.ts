import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const invitationRouter = router({
   // Mutations 
   createInvitation: protectedProcedure
   .input(z.object({eventId: z.string().uuid(), recipientId: z.string().uuid()}))
   .mutation(async ({ctx, input}) => {
        const invitation = await ctx.prisma.invitation.create({
            data: {
                recipient: {
                    connect: {
                        id: input.recipientId
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
   }),
   deleteBlockedInvitations: protectedProcedure
   .input(z.object({blockedId: z.string().uuid()}))
   .mutation(({ctx, input}) => {
        return ctx.prisma.invitation.deleteMany({
            where: {
                OR:
                [
                    {
                        recipientId: input.blockedId, 
                        AND: {
                            event: {
                                hostId: ctx.session.user.id
                            }
                        }
                    },
                    {
                        recipientId: ctx.session.user.id, 
                        AND: {
                            event: {
                                hostId: input.blockedId
                            }
                        }
                    }
                ]
            }
        })
   }),
   updateInvitation: protectedProcedure
   .input(z.object({eventId: z.string().uuid(), recipientId: z.string().uuid(), rsvp: z.string()}))
   .mutation(({ctx, input}) => {
        return ctx.prisma.invitation.update({
            where: {
                eventId_recipientId: {eventId: input.eventId, recipientId: input.recipientId}
            }, 
            data: {
                rsvp: input.rsvp
            }
        })
   })
});