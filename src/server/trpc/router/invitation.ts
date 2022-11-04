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
   .input(z.object({invitationId: z.string().uuid()}))
   .mutation(({ ctx, input }) => {
        return ctx.prisma.invitation.delete({
            where: {
                id: input.invitationId
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
   .input(z.object({invitationId: z.string().uuid(), rsvp: z.string()}))
   .mutation(({ctx, input}) => {
        return ctx.prisma.invitation.update({
            where: {
                id: input.invitationId
            }, 
            data: {
                rsvp: input.rsvp
            }
        })
   })
});