import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const friendshipRouter = router({
   // Mutations 
   createFriendship: protectedProcedure
   .input(z.object({initiatedById: z.string().uuid()}))
   .mutation(async ({ctx, input}) => {
        const friendship = await ctx.prisma.friendship.create({
            data: {
                initiatedBy: {
                    connect: {
                        id: input.initiatedById
                    }
                },
                acceptedBy: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
        
        return friendship
   }), 
   deleteFriendship: protectedProcedure
   .input(z.object({acceptedById: z.string().uuid(), initiatedById: z.string().uuid()}))
   .mutation(({ ctx, input }) => {
        return ctx.prisma.friendship.delete({
            where: {
                acceptedById_initiatedById: input
            }
        })
   })
});