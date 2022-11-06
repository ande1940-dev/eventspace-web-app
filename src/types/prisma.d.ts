import { Event, FriendRequest, Friendship, Invitation, JoinRequest, User} from "@prisma/client"

declare module "@prisma/client" {

  const commentChildrenInclude = Prisma.validator<Prisma.CommentInclude>()({
    children: true
  });

  export type CommentWithChildren = Prisma.CommentGetPayload<{
    include: typeof commentChildrenInclude
  }>;

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

  const notificationInclude = Prisma.validator<Prisma.NotificationInclude>()({
    comment: true,
    friendRequest: true,
    friendship: true,
    invitation: true,
    joinRequest: true,
  });

  export type NotificationWithRelations = Prisma.NotificationGetPayload<{
    include: typeof notificationInclude
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
  

  const userRequestInclude = Prisma.validator<Prisma.UserInclude>()({
    sentReceivedRequests: true
  });

  export type UserWithRequests = Prisma.UserGetPayload<{
    include: typeof userRequestInclude
  }>;
}
