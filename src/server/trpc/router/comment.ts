import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const commentsRouter = router({
    //Query 
    getCommentById: protectedProcedure
    .input(z.object({commentId: z.string().uuid()}))
    .query(({ctx, input}) => {
        return ctx.prisma.comment.findUnique({
            where: {
                id: input.commentId
            }
        })
    }),
    //Mutation
    createComment: protectedProcedure
    .input(z.object({authorId: z.string().uuid(), eventId: z.string().uuid(), parentId: z.string().uuid().optional(), text: z.string() }))
    .mutation(({ctx, input}) => {
        if (input.parentId === undefined) {
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
                    text: input.text
                }
            })
        } else {
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
                    parent: {
                        connect: {
                            id: input.parentId
                        }
                    },
                    text: input.text
                }
            })
        }
    })
})