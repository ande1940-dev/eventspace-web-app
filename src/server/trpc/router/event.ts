import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const eventRouter = router({
    //Queries 
    getEventById: protectedProcedure
    .input(z.object({eventId: z.string().uuid()}))
    .query(({ctx, input}) => {
        return ctx.prisma.event.findUnique({
            where: {
                id:input.eventId
            },
            include: {
                invitations: true,
                joinRequests: true
            }
        })
    }),
    getHostedEvents: protectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .query(({ctx, input}) => {
        return ctx.prisma.event.findMany({
            where: {
                hostId: input.userId
            }
        })
    }),
    //Mutations
    createEvent: protectedProcedure
    .input(z.object({name: z.string(), location: z.string(), startDate: z.date()}))
    .mutation(async ({ctx, input}) => {
        const event = await ctx.prisma.event.create({
            data: {
                name: input.name,
                location: input.location, 
                startDate: input.startDate,
                endDate: input.startDate,
                deadline: input.startDate,
                host: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
        
        return event
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