import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const commentsRouter = router({
    createComment: protectedProcedure
    .input(z.object({authorId: z.string().uuid(), eventId: z.string().uuid(), text: z.string() }))
    .mutation(({ctx, input}) => {
        return ctx.prisma.comment.create({
            data: {
                author: {
                    connect: {
                        id: input.authorId
                    }
                }, 
                event: {
                    connect: {
                        id: input.eventId
                    }
                },
                comment: input.text
            }
        })
    })
})