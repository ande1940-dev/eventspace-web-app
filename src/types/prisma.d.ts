import { Friendship, User, Prisma, FriendRequest } from "@prisma/client"

declare module "@prisma/client" {
  export type UserWithRelations = {
    id: string 
    name: string | null 
    email: string | null 
    image: string | null
    friended?: Friendship[]
    friendedBy?: Friendship[]
    hostedEvents?: Event[]
    sentFriendRequests?: FriendRequest[]
    receivedFriendRequests?: FriendRequest[]
    invitations?: Invitation[]
  }
}
