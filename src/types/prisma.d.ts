import { Event, FriendRequest, Friendship, Invitation, JoinRequest, User} from "@prisma/client"

declare module "@prisma/client" {

  const eventInvitationInclude = Prisma.validator<Prisma.EventInclude>()({
    invitations: true
  });

  export type EventWithInvitations = Prisma.EventGetPayload<{
    include: typeof eventInvitationInclude
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
