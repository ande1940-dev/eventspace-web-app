import { FriendRequest, Friendship } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }

  export type SessionUser = {
    id: string 
    name: string | null | undefined
    email: string | null | undefined
    image: string | null | undefined
  }
}
