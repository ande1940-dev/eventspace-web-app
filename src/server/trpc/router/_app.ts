// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";



import { commentsRouter } from "./comment";
import { blockRouter } from "./block";
import { eventRouter } from "./event";
import { friendRequestRouter } from "./friendRequest";
import { friendshipRouter } from "./friendship";
import { invitationRouter } from "./invitation";
import { joinRequestRouter } from "./joinRequest";
import { notificationRouter } from "./notification";
import { userRouter } from "./user"

export const appRouter = router({
  auth: authRouter,
  block: blockRouter,
  comment: commentsRouter,
  event: eventRouter,
  friendRequest: friendRequestRouter,
  friendship: friendshipRouter,
  invitation: invitationRouter,
  joinRequest: joinRequestRouter,
  notification: notificationRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
