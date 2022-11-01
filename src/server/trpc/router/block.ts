import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const blockRouter = router({
    //Mutations
    createBlock: protectedProcedure
    .input(z.object({blockedId: z.string().uuid()}))
    .mutation(async ({ctx, input}) => {
        const block = await ctx.prisma.block.create({
            data: {
                blocked: {
                    connect: {
                        id: input.blockedId
                    }
                },
                blockedBy: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
        
        return block
    }),
    deleteBlock: protectedProcedure
    .input(z.object({blockedId: z.string().uuid(), blockedById: z.string().uuid()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.block.delete({
            where: {
                blockedId_blockedById: input
            }, 
        })
    })
});