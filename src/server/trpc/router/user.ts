import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { User } from "@prisma/client";

export const userRouter = router({
    // Queries 
    getAllUsers: publicProcedure
    .query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            where: {
                NOT: {
                    id: ctx.session?.user?.id
                }
            },
            include: {
                friended: true,
                friendedBy: true
            }
        });
    }),
    getUserById: protectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .query(({ ctx, input }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input.userId
            },
            include: {
                blocked: true,
                blockedBy: true,
                friended: true,
                friendedBy: true,
                hostedEvents: {
                    include: {
                        invitations: true,
                        joinRequests: true
                    }
                },
                invitations: true,
                receivedFriendRequests: true,
                sentFriendRequests: true
            }
        })
    }), 
    getHostsByInvitee: protectedProcedure
    .query(({ ctx }) => {
        return ctx.prisma.user.findMany({
            where: {
                hostedEvents: {
                    some: {
                        invitations : {
                            some: {
                                recipientId: ctx.session.user.id
                            }
                        }
                    }
                }       
            }, 
            include: {
                hostedEvents: {
                    where: {
                        invitations: {
                            some: {
                                recipientId: ctx.session.user.id
                            }
                        }
                    }, 
                    include: {
                        invitations: true
                    }
                }
            }
        })
    }),
    getInviteesByEvent: protectedProcedure
    .input(z.object({eventId: z.string().uuid()}))
    .query(({ ctx, input }) => {
        return ctx.prisma.user.findMany({
            where: {      
                invitations: {
                    some: {
                        eventId: input.eventId
                    }
                } 
            }
        })
    }),
    getUninvitedByEvent: protectedProcedure
    .input(z.object({eventId: z.string().uuid()}))
    .query(({ ctx, input }) => {
        return ctx.prisma.user.findMany({
            where: { 
                NOT: [
                    {      
                        invitations: {
                            some: {
                                eventId: input.eventId
                            }
                        }
                    } 
                ], 
                AND: [
                    {
                        OR: [{
                            friended: {
                                some: {
                                    acceptedById: ctx.session.user.id
                                }
                            },  
                        }, 
                        {
                            friendedBy: {
                                some: {
                                    initiatedById: ctx.session.user.id
                                }
                            },  
                        }],
                    }
                ]
            }, 
        })
    }),
    getFriendsById: protectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .query(({ ctx, input }) => {
        return ctx.prisma.user.findMany({
            where: {
                OR: [{
                        friended: {
                            some: {
                                acceptedById: input.userId
                            }
                        },  
                    }, 
                    {
                        friendedBy: {
                            some: {
                                initiatedById: input.userId
                            }
                        },  
                    }],
            }, 
            orderBy: {
                name: "desc"
            }, 
            include: {
                blocked: true,
                blockedBy: true,
                friended: true,
                friendedBy: true,
                receivedFriendRequests: true,
                sentFriendRequests: true
            }
        })
    }),
    getSendersById: protectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .query(({ctx, input}) => {
        return ctx.prisma.user.findMany({
            where: {
                sentFriendRequests: {
                    some: {
                        recipientId: input.userId
                    }
                }
            }, 
            include: {
                sentFriendRequests: true
            }
        })
    }),
    // Mutations 
});
