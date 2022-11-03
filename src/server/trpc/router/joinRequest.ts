import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const joinRequestRouter = router({
   // Mutations 
   createJoinRequest: protectedProcedure
   .input(z.object({eventId: z.string().uuid()}))
   .mutation(({ctx, input}) => {
        return ctx.prisma.joinRequest.create({
            data: {
                sender: {
                    connect: {
                        id: ctx.session.user.id
                    }
                },
                event: {
                    connect: {
                        id: input.eventId
                    }
                }
            }
        })
   }), 
   deleteJoinRequest: protectedProcedure
   .input(z.object({eventId: z.string().uuid(), senderId: z.string().uuid()}))
   .mutation(({ ctx, input }) => {
        return ctx.prisma.joinRequest.delete({
            where: {
                eventId_senderId: input
            }
        })
   })
});
