import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const eventRouter = router({
    //Mutations
    createEvent: protectedProcedure
    .input(z.object({name: z.string()}))
    .mutation(async ({ctx, input}) => {
        const block = await ctx.prisma.event.create({
            data: {
                name: input.name,
                host: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
        
        return block
    }),
    deleteEvent: protectedProcedure
    .input(z.object({eventId: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.event.delete({
            where: {
                id: input.eventId
            }, 
        })
    })
});