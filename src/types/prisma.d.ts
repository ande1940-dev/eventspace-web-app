import { Event, FriendRequest, Friendship, Invitation, JoinRequest, User} from "@prisma/client"

declare module "@prisma/client" {

  const eventInvitationInclude = Prisma.validator<Prisma.EventInclude>()({
    invitations: true
  });

  export type EventWithInvitations = Prisma.EventGetPayload<{
    include: typeof eventInvitationInclude
  }>;

  const eventAllInclude = Prisma.validator<Prisma.EventInclude>()({
    invitations: true,
    comments: true
  });

  export type EventWithRelations = Prisma.EventGetPayload<{
    include: typeof eventAllInclude
  }>;

  const userCommentInclude = Prisma.validator<Prisma.UserInclude>()({
    comment: true
  });

  export type UserWithComments = Prisma.UserGetPayload<{
    include: typeof userCommentInclude
  }>;

  
  const userEventInclude = Prisma.validator<Prisma.UserInclude>()({
    hostedEvents: true
  });

  export type UserWithEvents = Prisma.UserGetPayload<{
    include: typeof userEventInclude
  }>;

  const userFriendInclude = Prisma.validator<Prisma.UserInclude>()({
    friended: true, 
    friendBy: true
  });

  export type UserWithFriends = Prisma.UserGetPayload<{
    include: typeof userFriendInclude
  }>;

}
